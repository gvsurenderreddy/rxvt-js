
var counter = 0;
/*
if(!console){
try{
    console ={log:function(){}};

} catch(e) {}
}
*/
function forward(num){
    counter += num;
    output_line(resp.slice(0,counter));
    document.getElementById('counter').innerHTML=counter;
}
function backward(num){
    counter -= num;
    output_line(resp.slice(0,counter));
    document.getElementById('counter').innerHTML=counter;
}

function soundSeek(position){
    document.getElementById("player").currentTime=position;
}
function soundPlay(position){
    document.getElementById("player").play();
}


function Animator(termEl, reqUrl){
    this.a = new rxvt_term(document.getElementById('term'),"pre_term");
    this.max_diff = .2;
    this.min_milli_jump=50;
    //this.a.row_buf=false;
    //this.a.scr_poweron();



    this.doAnimate=false;
    if (window.XMLHttpRequest)
	this.req = new XMLHttpRequest();
    else
	this.req = new ActiveXObject("Microsoft.XMLHTTP");

    this.req.open("GET",reqUrl, false);
    this.req.send(null);

    this.resp=this.req.responseText;

    this.setupTiming2();
    this.player_speed=1;

    var text = this.resp;

    //var bpf = Math.ceil(bps * mspf / 8000);
    var where = 0;
    var mspf = this.output_timing[0];
    var bpf = this.output_jumps[0];
    var timingPointer=0;
    var soundPointer=0;
    var player_el=document.getElementById('player');
    var local_output_timing=this.output_timing;
    var local_output_jumps=this.output_jumps;
    /*
      if(start_from){
      for(; timingPointer < start_from; timingPointer++){
      mspf=local_output_timing[timingPointer];
      soundPointer+=mspf/1000;
      bpf=local_output_jumps[timingPointer];
      where += bpf;
      }
      }
    */
    var stop = local_output_timing.length;//if(!end)
    var anim = this;
    var hnd;
    anim.to_func = function() {
        soundPointer+=mspf/1000;
        
        var diff = player_el.currentTime -soundPointer;
        if(diff > this.max_diff) {
            soundSeek(soundPointer);
            //console.log(diff);
        }
        
        bpf=local_output_jumps[timingPointer];
        mspf=local_output_timing[timingPointer];
        anim.output_line(text.substr(where, bpf));
                       
        //console.log(timingPointer, where, bpf);
        timingPointer++;
        //console.log(where, text.length);
        where += bpf;
        if(timingPointer >= stop || where >= text.length){
            //clearTimeout(hnd);
            //console.log("should no longer animate");
        }
        else {
            if (where >= text.length) {
                clearTimeout(anim.hnd);
                where = 0;
                timingPointer=0;
                anim.a.scr_poweron();
                setTimeout(me, 0);
                soundSeek(0);
            }
            else {
                anim.hnd = setTimeout(anim.to_func, mspf * anim.player_speed);
            }
        }
    };
    


}

Animator.prototype = {
    output_line : function (str){
        if(this.is_outputting){
            //console.log("outputting while already outputting");
        }
        this.is_outputting=true;
        //console.log(str);
        this.a.cmd_write(str, str.length);
        this.a.scr_refresh();
        this.is_outputting=false;
    },
    setupTiming2: function(){
        var added_time = [];

        for(var i = 0 ; i < timing.length-1; i++){
            var secs = timing[i][0];
            var micro_secs =(timing[i][1]/(1000*1000));
            //console.log("secs,micro_secs", secs,micro_secs);
        
            added_time.push(secs + micro_secs);
        }
        var startsecs=added_time[0];
        var zero_based_time = [];
        for(var i = 0 ; i < added_time.length; i++){
            var diff_secs = added_time[i]- startsecs;
            //console.log("diff_secs",diff_secs);
        
            zero_based_time.push(diff_secs);
            startsecs+=diff_secs;
        }


        this.output_jumps=[];
        this.output_timing=[];
        var residual_milli_jump=0;
        var residual_jump=timing[0][2];
        //var residual_jump = 0;

        for(var i = 0 ; i < added_time.length-1; i++){
            var current_jump = zero_based_time[i]*1000;
            residual_milli_jump += current_jump;
            residual_jump += timing[i+1][2];
            //if(current_jump< this.min_milli_jump){
            if(current_jump < this.min_milli_jump){
                continue;}
            else{
                this.output_timing.push(residual_milli_jump);
                this.output_jumps.push(residual_jump);
                //console.log(residual_jump,residual_milli_jump);
                residual_milli_jump=0;
                residual_jump=0;
            }
            
        }
    },
    pause : function(){
        clearTimeout(this.hnd);
    },
    play : function(){
        this.player_speed=1.0;
        this.hnd = setTimeout(this.to_func, 0);
    } ,
    fast_forward : function(){
        this.player_speed=.5;
        this.hnd = setTimeout(this.to_func, 0);
    } ,
    play_slow : function(){
        this.player_speed=2;
        this.hnd = setTimeout(this.to_func, 0);
    } ,
}

$('document').ready(

    function (){
        //a = new Animator("pt",tty_file);
        //this.VTAnimator2(this.resp, 0, this.resp.length);
        var a = new Animator("pt",tty_file);
        function animate(){
            doAnimate = true;
            //console.log('animate called');
       
            a.startAnimate();
            soundPlay();
            console.log(" animator setup ");
        }
        //console.log("ready function");
        //$('#play_start').click(animate);
        $('#play_start').click(function() {a.play();});
        $('#pause').click(function(){ a.pause();});
        $('#fast_forward').click(function(){a.fast_forward();});
        $('#play_slow').click(function(){a.play_slow();});
        /* $('#fast_forward').click(
            function(){
                //a.output_line(a.resp.slice(5150,5250));
                a.output_line(a.resp.slice(0,5850));
                a.a.scr_refresh();
                                 });
        */
    });