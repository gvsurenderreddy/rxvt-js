/*

  (fset 'paddy-next-digitUL
  (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ("\223[0-9a-f]UL" 0 "%d")) arg)))
  (local-set-key (kbd "H-C-n")  'paddy-next-digitUL)
  (fset 'paddy-remove-UL
  (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ([1 11 25 32 32 47 47 32 25 32 35 35 35 32 114 101 109 111 118 101 95 85 76 1 134217747 91 48 45 57 97 45 102 93 85 76 13 backspace backspace 1 14] 0 "%d")) arg)))
  (local-set-key (kbd "H-C-j") 'paddy-remove-UL)
  (fset 'paddy-cmnt-original
  (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ("  //" 0 "%d")) arg)))
  (local-set-key (kbd "H-C-;") 'paddy-cmnt-original)


*/

#ifndef RXVT_H_                /* include once only */
#define RXVT_H_

/*
  #include <cstdio>
  #include <cctype>
  #include <cerrno>
  #include <cstdarg>
  #include <cstdlib>
  #ifdef HAVE_STDINT_H
  #include <stdint.h>
  #endif
  #include <sys/types.h>
  #include <unistd.h>
  #include <cstring>
  #include <assert.h>
  #ifdef HAVE_SYS_IOCTL_H
  #include <sys/ioctl.h>
  #endif
  #ifdef HAVE_SYS_STRREDIR_H
  #include <sys/strredir.h>
  #endif

  #if HAVE_CWCHAR
  # include <cwchar>
  #elif HAVE_WCHAR_H
  # include <wchar.h>
  #else
  // stdlib.h might provide it
  #endif

*/

//using namespace std;
/*
  extern "C" {
  #include <X11/Xlib.h>
  #include <X11/Xutil.h>
  #include <X11/Xresource.h>
  }

  #if UNICODE_3
  typedef uint32_t text_t;
  #else
  typedef uint16_t text_t; // saves lots of memory
  #endif
  typedef uint32_t rend_t;
  typedef  int32_t tlen_t;  // was int16_t, but this results in smaller code and memory use
  typedef  int32_t tlen_t_; // specifically for use in the line_t structure

  //#include "feature.h"
  */


#if defined (ISO_14755) || defined (ENABLE_PERL)
# define ENABLE_OVERLAY 1
#endif

#if ENABLE_PERL
# define ENABLE_FRILLS    1
# define ENABLE_COMBINING 1
#endif

#if ENABLE_FRILLS
# define ENABLE_XEMBED        1
# define ENABLE_EWMH          1
# define ENABLE_XIM_ONTHESPOT 1
# define CURSOR_BLINK         1
# define OPTION_HC            1
# define BUILTIN_GLYPHS       1
#else
# define ENABLE_MINIMAL 1
#endif
/*
  #include <limits.h>

  #include <X11/cursorfont.h>
  #include <X11/keysym.h>
  #include <X11/keysymdef.h>
  #include <X11/Xatom.h>

  #include "encoding.h"

  #include "rxvtfont.h"
  #include "rxvttoolkit.h"
  #include "scrollbar.h"
  #include "ev_cpp.h"
  #include "salloc.h"
  #include "libptytty.h"
#include "rxvtutil.h.js"
  #include "rxvtperl.h"
*/
/*from rxvtperl.h */

#if ENABLE_PERL

#else
# define SHOULD_INVOKE(htype) false
# define HOOK_INVOKE(args) false
#endif

/* from feature.h */
#define MAX_COLS	10000
#define MAX_ROWS	10000

/*From background.c actually I think a lot of these are from optinc.h*/
Opt_secondaryScroll=22;
Opt_secondaryScreen=21;

NOCHAR = 0xffff,

  Opt_loginShell = 1,
  Opt_iconic = 2,
  Opt_visualBell = 3,
  Opt_mapAlert = 4,
  Opt_reverseVideo = 5,
  Opt_utmpInhibit = 6,
  Opt_scrollBar = 7,
  Opt_scrollBar_right = 8,
  Opt_scrollBar_floating = 9,
  Opt_meta8 = 10,
  Opt_scrollTtyOutput = 11,
  Opt_scrollTtyKeypress = 12,
  Opt_transparent = 13,
  Opt_tripleclickwords = 14,
  Opt_scrollWithBuffer = 15,
  Opt_jumpScroll = 16,
  Opt_skipScroll = 17,
  Opt_mouseWheelScrollPage = 18,



  Opt_pointerBlank = 0,

  Opt_cursorBlink = 20,
  Opt_secondaryScreen = 21,
  Opt_secondaryScroll = 22,
  Opt_pastableTabs = 23,
  Opt_cursorUnderline = 24,







  Opt_insecure = 0,
  Opt_borderLess = 0,
  Opt_hold = 0,
  Opt_override_redirect = 0,
  Opt_urgentOnBell = 0,




  Opt_skipBuiltinGlyphs = 0,




  Opt_intensityStyles = 0,


  Opt_iso14755_52 = 32,



  Opt_console = 33,



  Opt_buffered = 0;

/* from rxvtutil.h */

// in range including end

#define PP_CONCAT_(a, b) a ## b
#define PP_CONCAT(a, b) PP_CONCAT_(a, b)
#define PP_STRINGIFY_(a) #a
#define PP_STRINGIFY(a) PP_STRINGIFY_(a)

#define HAVE_GCC_BUILTINS (__GNUC__ >= 4 || (__GNUC__ == 3 && __GNUC_MINOR__ == 4))

//#if __GNUC__ >= 4
//# define rxvt_attribute(x) __attribute__(x)
//# define expect(expr,value)         __builtin_expect ((expr),(value))
//#else
# define rxvt_attribute(x)
# define expect(expr,value)         (expr)
//#endif

// put into ifs if you are very sure that the expression
// is mostly true or mosty false. note that these return
// booleans, not the expression.
#define expect_false(expr) expect ((expr) != 0, 0)
#define expect_true(expr)  expect ((expr) != 0, 1)

#define NORETURN rxvt_attribute ((noreturn))
#define UNUSED   rxvt_attribute ((unused))
#define CONST    rxvt_attribute ((const))

// increases code size unless -fno-enforce-eh-specs
#if __GNUC__
#define NOTHROW
#define THROW(x)
#else
#define NOTHROW  throw()
#define THROW(x) throw x
#endif
/*
  #def ine IN_R ANGE_INC(val,beg,end) \
  ((unsigned int)(val) - (unsigned int)(beg) <= (unsigned int)(end) - (unsigned int)(beg))

  // in range excluding end
  #de fine IN_RA NGE_EXC(val,beg,end)                                       \
  ((unsigned int)(val) - (unsigned int)(beg) <  (unsigned int)(end) - (unsigned int)(beg))
*/

#define IN_RANGE_INC(val,beg,end)               \
  ((val) - (beg) <= (end) - (beg))

// in range excluding end
#define IN_RANGE_EXC(val,beg,end)               \
  ((val) - (beg) <  (end) - (beg))


// for m >= -n, ensure remainder lies between 0..n-1
#define MOD(m,n) (((m) + (n)) % (n))


// try to avoid some macros to decrease code size, on some systems
#if ENABLE_MINIMAL
# define strcmp(a,b)   (strcmp)(a,b)
# define strlen(a)     (strlen)(a)
# define strcpy(a,b)   (strcpy)(a,b)
//# define memset(a,c,l) (memset)(a,c,l)
//# define memcpy(a,b,l) (memcpy)(a,b,l)
#endif
memset = function(destination, destination_i, source,  _length){
  for(var i =0; i < _length; i++){
    destination[destination_i + i]=source;
  }
  return destination;
}
  memcpy = function(destination, destination_i, source, source_i, _length){
    for(var i =0; i < _length; i++){
      destination[destination_i + i]=source[source_i+i];
    }
    return destination;

  }

  /*
*****************************************************************************
* SYSTEM HACKS
*****************************************************************************
*/

#ifndef HAVE_XPOINTER
  //typedef char *XPointer;
#endif

  //#include <termios.h>

  //#include "background.h"

#ifndef STDIN_FILENO
# define STDIN_FILENO   0
# define STDOUT_FILENO  1
# define STDERR_FILENO  2
#endif

#if !defined (EACCESS) && defined(EAGAIN)
# define EACCESS EAGAIN
#endif

#ifndef EXIT_SUCCESS            /* missing from <stdlib.h> */
# define EXIT_SUCCESS           0       /* exit function success */
# define EXIT_FAILURE           1       /* exit function failure */
#endif

#ifndef PATH_MAX
#define PATH_MAX 16384
#endif

  /****************************************************************************/

  // exception thrown on fatal (per-instance) errors
  //class rxvt_failure_exception { };

  // exception thrown when the command parser runs out of input data
  //class out_of_input { };

  /*
*****************************************************************************
* PROTOTYPES
*****************************************************************************
*/
  // main.C
#define SET_LOCALE(locale) rxvt_set_locale (locale)
  /*
  // misc.C

  /*
  *****************************************************************************
  * STRUCTURES AND TYPEDEFS
  *****************************************************************************
  */
#if ENABLE_XEMBED
#endif

  /*
*****************************************************************************
* NORMAL DEFINES
*****************************************************************************
*/

  /* COLORTERM, TERM environment variables */
#define COLORTERMENV    "rxvt"
#ifdef BG_IMAGE_FROM_FILE
# define COLORTERMENVFULL COLORTERMENV "-xpm"
#else
# define COLORTERMENVFULL COLORTERMENV
#endif
#ifndef TERMENV
# define TERMENV        "rxvt-unicode"
#endif

#if defined (NO_MOUSE_REPORT) && !defined (NO_MOUSE_REPORT_SCROLLBAR)
# define NO_MOUSE_REPORT_SCROLLBAR 1
#endif

#define scrollBar_esc           30

#if !defined (RXVT_SCROLLBAR) && !defined (NEXT_SCROLLBAR)
# define NO_SCROLLBAR_BUTTON_CONTINUAL_SCROLLING 1
#endif

    var
    NO_REFRESH       = 0, // Window not visible at all!      
  FAST_REFRESH     = 1, // Fully exposed window            
  SLOW_REFRESH     = 2 // Partially exposed window        
  ;

#ifdef NO_SECONDARY_SCREEN
# define NSCREENS               0
#else
# define NSCREENS               1
#endif

// special (internal) prefix for font commands 
#define FONT_CMD                '#'
#define FONT_DN                 "#-"
#define FONT_UP                 "#+"

// flags for rxvt_scr_gotorc () 
var
C_RELATIVE = 1,       // col movement is relative 
  R_RELATIVE = 2,       //row movement is relative 
  RELATIVE   = C_RELATIVE | R_RELATIVE;

// modes for rxvt_scr_insdel_chars (), rxvt_scr_insdel_lines () 
var
INSERT = -1, //				don't change these values 
  DELETE = +1,
  ERASE  = +2;

// modes for rxvt_scr_page () - scroll page. used by scrollbar window 
var
UP =0,
  DN =1,
  NO_DIR =2;

// arguments for rxvt_scr_change_screen () 
var
PRIMARY = 0,
  SECONDARY = 1;


#define RS_None                 0

// #d efine RS _fgMask               0x0000007fUL    // 128 colors ### remove_UL
// 128 colors  
#define RS_fgMask               0x0000007f    
//FIXED c_style_UL #de fine RS _bg Mask               0x00003f80UL    // 128 colors
// 128 colors  
#define RS_bgMask               0x00003f80    

// font styles
//FIXED c_style_UL #define RS_Bo ld                 0x00004000UL    // value 1
// value 1  
#define RS_Bold                 0x00004000
// #def ine RS_ I talic		0x00008000UL    // value 2 ### remove_UL
// value 2  
#define RS_Italic		0x00008000

// fake styles
//FIXED c_style_UL #d efine RS _Blink                0x00010000UL    // blink
// blink  
#define RS_Blink                0x00010000
//FIXED c_style_UL #defi ne RS_ RVid      
// reverse vid           0x00020000UL    // reverse video
#define RS_RVid                 0x00020000
//FIXED c_style_UL #def ine RS _Uline                0x00040000UL    // underline  eo  
// underline  
#define RS_Uline                0x00040000

// toggle this to force redraw, must be != RS_Carefu
//FIXED c_style_UL #de fine RS_red raw               0x01000000ULl
#define RS_redraw               0x01000000      

// 5 custom bits for extensions
#define RS_customCount          32
//FIXED c_style_UL #defin e RS_cus tomMask           0x00f80000UL      
#define RS_customMask           0x00f80000            
#define RS_customShift          19

// other flags
//FIXED c_style_UL #de fine RS _Careful		0x80000000UL	/* be careful when drawing these */            
#define RS_Careful		0x80000000	/* be careful when drawing these */            

#define RS_styleCount		4
#define RS_styleMask		(RS_Bold | RS_Italic)
#define RS_styleShift		14

#define RS_baseattrMask         (RS_Italic | RS_Bold | RS_Blink | RS_RVid | RS_Uline)
#define RS_attrMask             (RS_baseattrMask | RS_fontMask)

// not 127 or 256, see rxvtfont.h
#define RS_fontCount		127		
// plenty(?) of fonts, includes RS_Careful
#define RS_fontMask             0xff000000   
#define RS_fontShift            24

#define DEFAULT_RSTYLE  (RS_None | Color_fg | (Color_bg << Color_Bits))
#define OVERLAY_RSTYLE  (RS_None | Color_Black | (Color_Yellow << Color_Bits))

#define Sel_none                0       /* Not waiting */
#define Sel_normal              0x01    /* normal selection */
#define Sel_incr                0x02    /* incremental selection */
#define Sel_direct              0x00
#define Sel_Primary             0x01
#define Sel_Secondary           0x02
#define Sel_Clipboard           0x03
#define Sel_whereMask           0x0f
#define Sel_CompoundText        0x10    /* last request was COMPOUND_TEXT */
#define Sel_UTF8String          0x20    /* last request was UTF8_STRING */
/*
  enum {
  C0_NUL = 0x00,
  C0_SOH, C0_STX, C0_ETX, C0_EOT, C0_ENQ, C0_ACK, C0_BEL,
  C0_BS , C0_HT , C0_LF , C0_VT , C0_FF , C0_CR , C0_SO , C0_SI ,
  C0_DLE, C0_DC1, C0_DC2, D0_DC3, C0_DC4, C0_NAK, C0_SYN, C0_ETB,
  C0_CAN, C0_EM , C0_SUB, C0_ESC, C0_IS4, C0_IS3, C0_IS2, C0_IS1,
  };
*/
#define CHAR_ST                 0x9c    /* 0234 */

/*
 * XTerm Operating System Commands: ESC ] Ps;Pt (ST|BEL)
 * colour extensions by Christian W. Zuckschwerdt <zany@triq.net>
 */

//enum {
var  XTerm_name             =  0,
  XTerm_iconName         =  1,
  XTerm_title            =  2,
  XTerm_property         =  3,      // change X property
  XTerm_Color            =  4,      // change colors
  XTerm_Color00          = 10,      // change fg color
  XTerm_Color01          = 11,      // change bg color
  XTerm_Color_cursor     = 12,      // change actual 'Cursor' color
  XTerm_Color_pointer_fg = 13,      // change actual 'Pointer' fg color
  XTerm_Color_pointer_bg = 14,      // change actual 'Pointer' bg color
  XTerm_Color05          = 15,      // not implemented (tektronix fg)
  XTerm_Color06          = 16,      // not implemented (tektronix bg)
  XTerm_Color_RV         = 17,      // change actual 'Highlight' color
  XTerm_logfile          = 46,      // not implemented
  XTerm_font             = 50,

  XTerm_konsole30        = 30,      // reserved for konsole
  XTerm_konsole31        = 31,      // reserved for konsole
  XTerm_emacs51          = 51,      // reserved for emacs shell

// rxvt extensions of XTerm OSCs: ESC ] Ps;Pt (ST|BEL)


// deprecated
  Rxvt_Color_BD          = 18,
  Rxvt_Color_UL          = 19,
  Rxvt_restoreFG         = 39,
  Rxvt_restoreBG         = 49,

  Rxvt_Pixmap            = 20,      // new bg pixmap
  Rxvt_dumpscreen        = 55,      // dump scrollback and all of screen

  URxvt_locale           = 701,     // change locale
  URxvt_version          = 702,     // request version

  URxvt_Color_IT         = 704,     // change actual 'Italic' colour
  URxvt_Color_tint       = 705,     // change actual tint colour
  URxvt_Color_BD         = 706,     // change actual 'Bold' color
  URxvt_Color_UL         = 707,     // change actual 'Underline' color
  URxvt_Color_border     = 708,

  URxvt_font             = 710,
  URxvt_boldFont         = 711,
  URxvt_italicFont       = 712,
  URxvt_boldItalicFont   = 713,

  URxvt_view_up          = 720,
  URxvt_view_down        = 721,

  URxvt_perl             = 777;     // for use by perl extensions, starts with "extension-name;"


/* Words starting with `Color_' are colours.  Others are counts */
/*
 * The PixColor and rendition colour usage should probably be decoupled
 * on the unnecessary items, e.g. Color_pointer, but won't bother
 * until we need to.  Also, be aware of usage in pixcolor_set
 */


var
Color_none = -2,
  Color_transparent = -1,
  Color_fg = 0,
  Color_bg = 1,
  minCOLOR = 2,                   /* 2 */
  Color_Black = minCOLOR,
  Color_Red3 =3,
  Color_Green3 =4,
  Color_Yellow3 =5,
  Color_Blue3 = 6,
  Color_Magenta3 = 7,
  Color_Cyan3 =8,
  maxCOLOR = 9,                   /* minCOLOR + 7 */
#ifndef NO_BRIGHTCOLOR
  Color_AntiqueWhite = maxCOLOR,
  minBrightCOLOR =10,             /* maxCOLOR + 1 */
  Color_Grey25 = minBrightCOLOR,
  Color_Red =11,
  Color_Green = 12 ,
  Color_Yellow =13,
  Color_Blue =14,
  Color_Magenta =15,
  Color_Cyan =16,
  maxBrightCOLOR =17,             /* minBrightCOLOR + 7 */
  Color_White = maxBrightCOLOR,
#else
  Color_White = maxCOLOR,
#endif
  minTermCOLOR = Color_White + 1,
  maxTermCOLOR = Color_White + 72,
#ifndef NO_CURSORCOLOR
  Color_cursor =18,
  Color_cursor2 =19,
#endif
  Color_pointer_fg =20,
  Color_pointer_bg =21,
  Color_border = 22,
#ifndef NO_BOLD_UNDERLINE_REVERSE
  Color_BD = 23,
  Color_IT = 24,
  Color_UL = 25,
  Color_RV = 26,
#endif
#if ENABLE_FRILLS
  Color_underline,
#endif
#ifdef OPTION_HC
  Color_HC,
#endif
  Color_scroll = 27,
#ifdef RXVT_SCROLLBAR
  Color_trough,
#endif
#if ENABLE_TRANSPARENCY
  Color_tint,
#endif
#if OFF_FOCUS_FADING
  Color_fade,
#endif
  NRS_COLORS = 28,                 /* */
#ifdef RXVT_SCROLLBAR
  Color_topShadow = NRS_COLORS,
  Color_bottomShadow,
  TOTAL_COLORS
#else
  TOTAL_COLORS = NRS_COLORS
#endif
  ;
// 0 .. maxTermCOLOR
#define Color_Bits      7 

/*
 * Resource list
 */

# define def(name) Rs_ ## name,
# define reserve(name,count) Rs_ ## name ## _ = Rs_ ## name + (count) - 1,
//# include "rsinc.h"
# undef def
# undef reserve
//  NUM_RESOURCES


//FIXME does bitshifting an unsigned long result in a different value than bitshifting any number in js would?


#define PrivMode_132            (1<<0)
#define PrivMode_132OK          (1<<1)
#define PrivMode_rVideo         (1<<2)
#define PrivMode_relOrigin      (1<<3)
#define PrivMode_Screen         (1<<4)
#define PrivMode_Autowrap       (1<<5)
#define PrivMode_aplCUR         (1<<6)
#define PrivMode_aplKP          (1<<7)
#define PrivMode_HaveBackSpace  (1<<8)
#define PrivMode_BackSpace      (1<<9)
#define PrivMode_ShiftKeys      (1<<10)
#define PrivMode_VisibleCursor  (1<<11)
#define PrivMode_MouseX10       (1<<12)
#define PrivMode_MouseX11       (1<<13)
#define PrivMode_scrollBar      (1<<14)
#define PrivMode_TtyOutputInh   (1<<15)
#define PrivMode_Keypress       (1<<16)
#define PrivMode_smoothScroll   (1<<17)
#define PrivMode_vt52           (1<<18)
#define PrivMode_LFNL		(1<<19)
#define PrivMode_MouseBtnEvent  (1<<20)
#define PrivMode_MouseAnyEvent  (1<<21)
#define PrivMode_BracketPaste   (1<<22)

#define PrivMode_mouse_report   (PrivMode_MouseX10|PrivMode_MouseX11|PrivMode_MouseBtnEvent|PrivMode_MouseAnyEvent)

#ifdef ALLOW_132_MODE
# define PrivMode_Default (PrivMode_Autowrap|PrivMode_ShiftKeys|PrivMode_VisibleCursor|PrivMode_132OK)
#else
# define PrivMode_Default (PrivMode_Autowrap|PrivMode_ShiftKeys|PrivMode_VisibleCursor)
#endif

// do not change these constants li
// input modifier buffer sizesghtly, there are many interdependencies
#define IMBUFSIZ               128 
#define KBUFSZ                 512     
// size of command buffer// size of keyboard mapping buffer
#define CBUFSIZ                204
// never call pty_fill/cmd_parse more than this often in a row8    
#define CBUFCNT                8  
// character buffer
#define UBUFSIZ                2048  

#if ENABLE_FRILLS
//# include <X11/Xmd.h>
/*
  typedef struct _mwmhints
  {
  CARD32 flags;
  CARD32 functions;
  CARD32 decorations;
  INT32  input_mode;
  CARD32 status;
  } MWMHints;
*/
#endif

/* Motif window hints */
#define MWM_HINTS_FUNCTIONS     (1 << 0)
#define MWM_HINTS_DECORATIONS   (1 << 1)
#define MWM_HINTS_INPUT_MODE    (1 << 2)
#define MWM_HINTS_STATUS        (1 << 3)
/* bit definitions for MwmHints.functions */
#define MWM_FUNC_ALL            (1 << 0)
#define MWM_FUNC_RESIZE         (1 << 1)
#define MWM_FUNC_MOVE           (1 << 2)
#define MWM_FUNC_MINIMIZE       (1 << 3)
#define MWM_FUNC_MAXIMIZE       (1 << 4)
#define MWM_FUNC_CLOSE          (1 << 5)
/* bit definitions for MwmHints.decorations */
#define MWM_DECOR_ALL           (1 << 0)
#define MWM_DECOR_BORDER        (1 << 1)
#define MWM_DECOR_RESIZEH       (1 << 2)
#define MWM_DECOR_TITLE         (1 << 3)
#define MWM_DECOR_MENU          (1 << 4)
#define MWM_DECOR_MINIMIZE      (1 << 5)
#define MWM_DECOR_MAXIMIZE      (1 << 6)
/* bit definitions for MwmHints.inputMode */
#define MWM_INPUT_MODELESS                  0
#define MWM_INPUT_PRIMARY_APPLICATION_MODAL 1
#define MWM_INPUT_SYSTEM_MODAL              2
#define MWM_INPUT_FULL_APPLICATION_MODAL    3
#define PROP_MWM_HINTS_ELEMENTS             5

/*
*****************************************************************************
* MACRO DEFINES
*****************************************************************************
*/
#define dLocal(type,name)       type const name = this->name

// for speed reasons, we assume that all codepoints 32 to 126 are
// single-width.
#define WCWIDTH(c)		(IN_RANGE_INC (c, 0x20, 0x7e) ? 1 : wcwidth (c))

/* convert pixel dimensions to row/column values.  Everything as int32_t */
#define Pixel2Col(x)            Pixel2Width((int32_t)(x))
#define Pixel2Row(y)            Pixel2Height((int32_t)(y))
#define Pixel2Width(x)          ((int32_t)(x) / (int32_t)fwidth)
#define Pixel2Height(y)         ((int32_t)(y) / (int32_t)fheight)
#define Col2Pixel(col)          ((int32_t)Width2Pixel(col))
#define Row2Pixel(row)          ((int32_t)Height2Pixel(row))
#define Width2Pixel(n)          ((int32_t)(n) * (int32_t)fwidth)
#define Height2Pixel(n)         ((int32_t)(n) * (int32_t)fheight)

//#defi ne LIN ENO_of(t,n) MOD ((t)->term_start + int(n), (t)->total_rows)
#define LINENO_of(t,n) MOD (t.term_start + n, t.total_rows) 
//#def ine RO W_of(t,n) (t->row_buf [LINENO_of ((t), n)]
#define ROW_of(t,n) (t.row_buf [LINENO_of ((t), n)])

#define LINENO(n) LINENO_of (this, n)
#define ROW(n) ROW_of (this, n)

/* how to build & extract colors and attributes */
#define GET_BASEFG(x)           (((x) & RS_fgMask))
#define GET_BASEBG(x)           (((x) & RS_bgMask)>>Color_Bits)

#define GET_FONT(x)             (((x) & RS_fontMask) >> RS_fontShift)
#define SET_FONT(x,fid)         (((x) & ~RS_fontMask) | ((fid) << RS_fontShift))

#define GET_STYLE(x)		(((x) & RS_styleMask) >> RS_styleShift)
#define SET_STYLE(x,style)	(((x) & ~RS_styleMask) | ((style) << RS_styleShift))

#define GET_ATTR(x)             (((x) & RS_attrMask))
#define GET_BGATTR(x)                                           \
  (((x) & RS_RVid) ? (((x) & (RS_attrMask & ~RS_RVid))          \
                      | (((x) & RS_fgMask)<<Color_Bits))        \
   : ((x) & (RS_attrMask | RS_bgMask)))
#define SET_FGCOLOR(x,fg)       (((x) & ~RS_fgMask)   | (fg))
#define SET_BGCOLOR(x,bg)       (((x) & ~RS_bgMask)   | ((bg)<<Color_Bits))
#define SET_ATTR(x,a)           (((x) & ~RS_attrMask) | (a))

#define RS_SAME(a,b)		(!(((a) ^ (b)) & ~RS_Careful))

#define PIXCOLOR_NAME(idx)      rs[Rs_color + (idx)]
#define ISSET_PIXCOLOR(idx)     (!!rs[Rs_color + (idx)])

#if ENABLE_STYLES
//# def ine FONTSET_of(t,style) (t)->fontset[GET_STYLE (style)]
# define FONTSET_of(t,style) t.fontset[GET_STYLE (style)]  
#else
//# define FONTSET_of(t,style) (t)->fontset[0]
# define FONTSET_of(t,style) t.fontset[0]  
#endif
//#de fine FON TSET(style) FONTSET_of (this, style)
#define FONTSET(style) FONTSET_of (this, style)  

//typedef callback<void (const char *)> log_callback;
//typedef callback<int (int)> getfd_callback;

/****************************************************************************/

#define LINE_LONGER     0x0001
// line has been filtered // line is continued on the next row
#define LINE_FILTERED   0x0002
// line has been compressed (NYI)
#define LINE_COMPRESSED 0x0004 
// line needs to be filtered before display (NYI)
#define LINE_FILTER     0x0008 
// line needs bidi (NYI)
#define LINE_BIDI       0x0010 

/*
  struct line_t
  {
  text_t *t; // terminal the text
  rend_t *r; // rendition, uses RS_ flags
  tlen_t_ l; // length of each text line
  uint32_t f; // flags

  bool is_longer ()
  {
  return f & LINE_LONGER;
  }

  void is_longer (int set)
  {
  if (set)
  f |= LINE_LONGER;
  else
  f &= ~LINE_LONGER;
  }

  void clear ()
  {
  t = 0;
  r = 0;
  l = 0;
  f = 0;
  }

  void touch () // call whenever a line is changed/touched/updated
  {
  #if ENABLE_PERL
  f &= ~LINE_FILTERED;
  #endif
  }

  void touch (int col)
  {
  max_it (l, col);
  touch ();
  }
  };

*/
line_t = function() {};
line_t.prototype = {
 t: "" , //FIXED   text_t *t; // terminal the text
 r: "" , //FIXED   rend_t *r; // rendition, uses RS_ flags
 l: "" , //FIXED   tlen_t_ l; // length of each text line
 f: "" , //FIXED  uint32_t f; // flags
    
 is_longer : function(set){  //FIXME overloaded function, check js translation
    if(set){
      this.f |= 0x0001; // line is continued on the next row;
    }
    else if (1){
      this.f &= ~0x0001; // line is continued on the next row;
    }
        
    else {
      return f & 0x0001 // line is continued on the next row;
    }},
 /*
   is_longer : function(set){  //FIXME overloaded function, check js translation
   if(set){  //why two if(set)'s??? FIXME
   if (set)
   this.f |= LINE_LONGER;
   else
   this.f &= ~LINE_LONGER;

   }
   else {
   return f & LINE_LONGER;
   }
   },
 */
 clear : function ()   { //FIXME should this whole thing be an object, probably
    this.t = 0;
    this.r = 0;
    this.l = 0;
    this.f = 0;
  },

 //FIXME operator overloading
 touch : function (col) { // call whenever a line is changed/touched/updated  //   void touch () // call whenever a line is changed/touched/updated

#if ENABLE_PERL
    f &= ~LINE_FILTERED;
#endif
    if(typeof col != undefined){
      max(l, col);
    }
  }
};

/****************************************************************************/

// primitive wrapper around mbstate_t to ensure initialisation
/*
  this is used once here   in command.C.js rxvt_term.next_char
  struct mbstate
  {
  mbstate_t mbs;

  operator mbstate_t *() { return &mbs; }
  void reset () { memset (&mbs, 0, sizeof (mbs)); }
  mbstate () { reset (); }
  };
*/
/****************************************************************************/

//FIXED c_style_ul #define UNICODE_MASK 0x1fffffUL
#define UNICODE_MASK 0x1fffff 

#if UNICODE_3
//FIXED c_style_UL # define COMPOSE_LO 0x40000000UL
# define COMPOSE_LO 0x40000000 
//FIXED c_style_UL # define COMPOSE_HI 0x400fffff 
# define COMPOSE_HI 0x400fffff 
# define IS_COMPOSE(n) ((int32_t)(n) >= COMPOSE_LO)
#else
# if ENABLE_PERL
//FIXED c_style_UL #  define COMPOSE_LO 0xe000UL // our _own_ functions don't like (illegal) surrogates
#  define COMPOSE_LO 0xe000 // our _own_ functions don't like (illegal
//FIXED c_style_UL #  define COMPOSE_HI 0xf8ffUL // in utf-8, so use private use area only) surrogates 
#  define COMPOSE_HI 0xf8ff // in utf-8, so use private use area only 
# else
//FIXED c_style_UL #  define COMPOSE_LO 0xd800UL
#  define COMPOSE_LO 0xd800 
//FIXED c_style_UL #  define COMPOSE_HI 0xf8ffUL 
#  define COMPOSE_HI 0xf8ff 
# endif
# define IS_COMPOSE(n) IN_RANGE_INC ((n), COMPOSE_LO, COMPOSE_HI)
#endif

#if ENABLE_COMBINING
// compose chars are used to represent composite characters
// that are not representable in unicode, as well as characters
// not fitting in the BMP.
/*
  This is never used with the config variables I use
  struct compose_char
  {
  unicode_t c1, c2; // any chars != NOCHAR are valid
  compose_char (unicode_t c1, unicode_t c2)
  : c1(c1), c2(c2)
  { }
  };

  class rxvt_composite_vec
  {
  vector<compose_char> v;
  public:
  text_t compose (unicode_t c1, unicode_t c2 = NOCHAR);
  int expand (unicode_t c, wchar_t *r);
  compose_char *operator [](text_t c)
  {
  return c >= COMPOSE_LO && c < COMPOSE_LO + v.size ()
  ? &v[c - COMPOSE_LO]
  : 0;
  }
  };
*/
//extern class rxvt_composite_vec rxvt_composite;
#endif

/****************************************************************************/

#ifdef KEYSYM_RESOURCE
//class keyboard_manager;
#endif
/*
  typedef struct rxvt_term *rxvt_t;

  extern rxvt_t rxvt_current_term;
*/
#define SET_R(r) rxvt_current_term = const_cast<rxvt_term *>(r)
#define GET_R rxvt_current_term

function row_col_t(){};
row_col_t.prototype = {row:0, col:0};
/* ------------------------------------------------------------------------- */
/*
  This doesn't seem to be used
  struct overlay_base
  {
  int x, y, w, h; // overlay dimensions
  text_t **text;
  rend_t **rend;

  // while tempting to add swap() etc. here, it effetcively only increases code size
  };
*/
/* ------------------------------------------------------------------------- */
/*
  typedef struct
  {
  int row;
  int col;
  } row_col_t;

  /*
  * terminal limits:
  *
  *  width      : 1 <= width
  *  height     : 1 <= height
  *  ncol       : 1 <= ncol       <= MAX(tlen_t)
  *  nrow       : 1 <= nrow       <= MAX(int)
  *  saveLines  : 0 <= saveLines  <= MAX(int)
  *  term_start : 0 <= term_start < saveLines
  *  total_rows : nrow + saveLines
  *
  *  top_row    : -saveLines <= top_row    <= 0
  *  view_start : top_row    <= view_start <= 0
  *
  *          | most coordinates are stored relative to term_start,
  *  ROW_BUF | which is the first line of the terminal screen
  *  |························= row_buf[0]
  *  |························= row_buf[1]
  *  |························= row_buf[2] etc.
  *  |
  *  +------------+···········= term_start + top_row
  *  | scrollback |
  *  | scrollback +---------+·= term_start + view_start
  *  | scrollback | display |
  *  | scrollback | display |
  *  +------------+·display·+·= term_start
  *  |  terminal  | display |
  *  |  terminal  +---------+
  *  |  terminal  |
  *  |  terminal  |
  *  +------------+···········= term_start + nrow - 1
  *  |
  *  |
  *  END······················= total_rows
  */
/*
  I dont seem to use TermWin_t   it seems to be an x11 construct
  struct TermWin_t
  {
  width: "",                    //  int                     window width                    [pixels]
  height: "",                    //  int                    window height                   [pixels]
  fwidth: "",                    //  int                    font width                      [pixels]
  fheight: "",                    //  int                   font height                     [pixels]
  fbase: "",                    //  int                     font ascent (baseline)          [pixels]
  ncol: "",                    //  int                      window columns              [characters]
  nrow: "",                    //  int                      window rows                 [characters]
  focus: "",                    //  int                     window has focus                        
  mapped: "",                    //  int                    window state mapped?                    
  bwidth: "",                    //  int            int_    internal border width                   
  bwidth: "",                    //  int            ext_    external border width                   
  lineSpace: "",                    //  int                 number of extra pixels between rows     
  saveLines: "",                    //  int                 number of lines that fit in scrollback  
  rows: "",                    //  int            total_    total number of rows in this terminal   
  start: "",                    //  int            term_    term lines start here                   
  start: "",                    //  int            view_    scrollback view starts here             
  row: "",                    //  int            top_       topmost row index of scrollback         
  6]: "",                    //  Window         parent[     parent identifiers - we're parent[0]    
  vt: "",                    //  Window                     vt100 window                            
  gc: "",                    //  GC                         GC for drawing                          
  pixmap: "",                    //  Pixmap         
  drawable: [], drawable_i:0,                    //  rxvt_drawable *
  fontset : new Array(4), fontset_i:0                    //  rxvt_fontset  *fontset[4]
  };
*/
/*

 * screen accounting:
 * screen_t elements
 *   row:       Cursor row position                   : 0 <= row < nrow
 *   col:       Cursor column position                : 0 <= col < ncol
 *   tscroll:   Scrolling region top row inclusive    : 0 <= row < nrow
 *   bscroll:   Scrolling region bottom row inclusive : 0 <= row < nrow
 *
 * selection_t elements
 *   clicks:    1, 2 or 3 clicks - 4 indicates a special condition of 1 where
 *              nothing is selected
 *   beg:       row/column of beginning of selection  : never past mark
 *   mark:      row/column of initial click           : never past end
 *   end:       row/column of one character past end of selection
 * * Note: top_row <= beg.row <= mark.row <= end.row < nrow
 * * Note: col == -1 ==> we're left of screen
 *
 */
/*
  struct screen_t
  {
  row_col_t       cur;          cursor position on the screen           
  int             tscroll;      top of settable scroll region           
  int             bscroll;      bottom of settable scroll region        
  unsigned int    charset;      character set number [0..3]             
  unsigned int    flags;        see below                               
  row_col_t       s_cur;        saved cursor position                   
  unsigned int    s_charset;    saved character set number [0..3]       
  char            s_charset_char;
  rend_t          s_rstyle;     saved rendition style                
  };
*/

screen_t = function() {}
  screen_t.prototype ={
  cur: row_col_t(),                   //     row_col_t  cursor position on the screen            
  tscroll: "",               //  int                         top of settable scroll region
  bscroll: "",               //  int                         bottom of settable scroll region
  charset: "",               //  unsigned int                character set number [0..3]
  flags: "",                 //  unsigned int                see below
  s_cur: row_col_t(),                   //  row_col_t       s_          saved cursor position
  charset: "",               //  unsigned int    s_          saved character set number [0..3]
  s_charset_char : "",       //  char
  rstyle: ""                 //  rend_t          s_          saved rendition style
  };                                      





//enum selection_op_t

//struct selection_t

/* ------------------------------------------------------------------------- */

/* screen_t flags */
#define Screen_Relative          (1<<0)  /* relative origin mode flag         */
#define Screen_VisibleCursor     (1<<1)  /* cursor visible?                   */
#define Screen_Autowrap          (1<<2)  /* auto-wrap flag                    */
#define Screen_Insert            (1<<3)  /* insert mode (vs. overstrike)      */
#define Screen_WrapNext          (1<<4)  /* need to wrap for next char?       */
#define Screen_DefaultFlags      (Screen_VisibleCursor | Screen_Autowrap)

/* rxvt_vars.options */

# define def(name,idx) Opt_ ## name = idx,
# define nodef(name)   Opt_ ## name = 0,
//# includeoptinc.h"
# undef nodef
# undef def
//Opt_count


/* ------------------------------------------------------------------------- */
/*
  struct rxvt_vars : TermWin_t
  {
  scrollBar_t     scrollBar;
  uint8_t         options[(Opt_count + 7) >> 3];
  XSizeHints      szHint;
  rxvt_color     *pix_colors;
  Cursor          TermWin_cursor;       // cursor for vt window 
  int             numlock_state;
  line_t         *row_buf;      // all lines, scrollback + terminal, circular, followed by temp_buf
  line_t         *drawn_buf;    // text on screen
  line_t         *swap_buf;     // lines for swap buffer
  char           *tabs;         // per location: 1 == tab-stop               
  screen_t        screen;
  screen_t        swap;
  selection_t     selection;
  rxvt_color      pix_colors_focused[TOTAL_COLORS];
  #ifdef OFF_FOCUS_FADING
  rxvt_color      pix_colors_unfocused[TOTAL_COLORS];
  #endif
  };
*/
rxvt_vars = function() {}
  rxvt_vars.prototype={
  scrollBar : "",                     //   scrollBar_t 
  //    options : [(Opt_count + 7) >> 3], //     uint8_t
  szHint : "" ,    //XSizeHints      
  pix_colors : [], pix_colors_i:0,   //rxvt_color     * 
  TermWin_cursor : "",         //Cursor       /* cursor for vt window */
  numlock_state: 0,            //int
  row_buf : [], row_buf_i:0,   //line_t* 
  // row_buf is all lines, scrollback + terminal, circular, followed by temp_buf
  drawn_buf : [], drawn_buf_i:0, //  line_t         *     // text on screen
  swap_buf : [] , swap_buf_i:0 , //  line_t         * ;     // lines for swap buffer
  tabs: [], tabs_i:0,            //    char           *   /* per location: 1 == tab-stop*/
  screen: "",                    //    screen_t        
  swap: "",                      //    screen_t        
  selection : "",                //    selection_t
  pix_colors_focused: new Array(TOTAL_COLORS) //    rxvt_color
#ifdef OFF_FOCUS_FADING
  ,
  pix_colors_unfocused: new Array(TOTAL_COLORS)  //    rxvt_color
#endif
  };
function rxvt_term() {}  //FIXME
rxvt_term.prototype = {
// special markers with magic addresses
 resval_undef : [],  //static const char      // options specifically unset
 resval_on : [],       //static const char      // boolean options switched on
 resval_off :[],      //static const char      // or off

 log_hook: [],        //log_callback   ptr_arr   // log error messages through this hook, if != 0
 log_hook_ptr: 0,       //log_hook_ptr
 getfd_hook: "",        //getfd_callback *  some wierd function callback   // convert remote to local fd, if != 0
#if ENABLE_PERL
 //rxvt_perl_term  perl;
#endif
 //struct mbstate  mbstate;              // current input multibyte state

 want_refresh:1,     //unsigned char
  current_screen:1,	// primary or secondary              
  num_scr_allow:1,
  bypass_keystate:1,
#if ENABLE_FRILLS
  urgency_hint:1,
#endif
#if CURSOR_BLINK
  hidden_cursor:1,
#endif
#if TEXT_BLINK
  hidden_text:1,
#endif
#if POINTER_BLANK
  hidden_pointer:1,
#endif
  enc_utf8:1,		// wether locale uses utf-8 
  seen_input:1,         // wether we have seen some program output yet 
  seen_resize:1,	// wether we had a resize event 
 parsed_geometry:1,

 refresh_type: "",        //unsigned char   
#ifdef META8_OPTION
 //  meta_char,            // Alt-key prefix 
#endif
 selection_wait: 0, //
 selection_type: 0, // ??? do variables in structs default to ints?, ;
// ---------- 
 rvideo_state: true, rvideo_mode: true,  //bool
#ifndef NO_BELL
 rvideo_bell :true, // bool            
#endif
 num_scr: 0,              // int   screen: number lines scrolled 
 prev_ncol: 0 ,           // int // screen: previous number of columns 
 prev_nrow: 0,            // int // screen: previous number of rows 
// ---------- 
 rstyle: "" ,             // rend_t          
// ---------- 
#ifdef SELECTION_SCROLLING
 //int             scroll_selection_lines;
 //enum page_dirn  scroll_selection_dir;
 //int             selection_save_x,
 //  selection_save_y,
 //  selection_save_state;
#endif
// ---------- 
//int             csrO,       // Hops - csr offset in thumb/slider to      
//   give proper Scroll behaviour            
#if defined(MOUSE_WHEEL) && defined(MOUSE_SLIP_WHEELING)
 //mouse_slip_wheel_speed,
#endif
 refresh_count : 0, // I guess for all of the following c defualts to ints
 window_vt_x  :0,
 window_vt_y :0,
 mouse_row: 0,
 mouse_col: 0,
# ifdef POINTER_BLANK
 pointerBlankDelay :0,
# endif
 allowedxerror: 0,  //probably never used
// ---------- 
//unsigned int    ModLevel3Mask,
//  ModMetaMask,
//  ModNumLockMask;
 old_width: 0,  //int last used width in screen resize          
 old_height: 0, //int last used height in screen resize         
 priv_modes:0 , //unsigned long   
 SavedModes:"", //  SavedModes;
// ---------- 
 xa :[] ,  //Atom            *;
 xa_ptr:0,
// ---------- 
//Time            selection_time,
//  selection_request_time;
 //pid_t           cmd_pid;    // process id of child 
 incr_buf: [], // char * 
 incr_buf_ptr : 0,
 //size_t          incr_buf_size, incr_buf_fill;
// ---------- 
//struct mouse_event MEvent;
//XComposeStatus  compose;
//struct termios  tio;  //FIXME termios might be needed
 oldcursor: row_col_t(), //row_col_t
#ifdef HAVE_BG_PIXMAP
 //bgPixmap_t      bgPixmap;
#endif
#ifdef HAVE_AFTERIMAGE
 //ASVisual       *asv;
 //ASImageManager *asimman;
 /*
void init_asv ()
{
  if (!asv)
    asv = create_asvisual_for_id (dpy, display->screen, depth, XVisualIDFromVisual (visual), cmap, NULL);
    }*/
#endif

 allocated: [], //???? // vector<void *> allocated;           // free these memory blocks with free()

 //char            env_windowid[21];   // environmental variable WINDOWID 
 //char            env_colorfgbg[sizeof ("COLORFGBG=default;default;bg") + 1];
 //char           *env_display;        // environmental variable DISPLAY  
 //char           *env_term;           // environmental variable TERM     
 //char           *locale;
 //char            charsets[4];
 v_buffer: [], //char           *v_buffer;           // pointer to physical buffer 
 v_buffer_ptr:0,
 v_buflen : 0 , //unsigned int    v_buflen;           // size of area to write 
 //stringvec      *argv, *envv;        // if != 0, will be freed at destroy time 

#ifdef KEYSYM_RESOURCE
 //keyboard_manager *keyboard;
#endif
#ifndef NO_RESOURCES
 //XrmDatabase option_db;
#endif

 rs:[],//const char     *rs[NUM_RESOURCES];
 rs_ptr:0,
// command input buffering 
 cmdbuf : [],
 cmdbuf_ptr:0, cmdbuf_endp:0,//char           *cmdbuf_ptr, *cmdbuf_endp;
 cmdbuf_base : [], //char            cmdbuf_base[CBUFSIZ];

 //ptytty         *pty;

 //rxvt_salloc    *talloc;             // text line allocator
 //rxvt_salloc    *ralloc;             // rend line allocator

 //static vector<rxvt_term *> termlist; // a vector of all running rxvt_term's

}
/*
  struct rxvt_term : zero_initialized, rxvt_vars, rxvt_screen
  {

  // special markers with magic addresses
  static const char resval_undef [];    // options specifically unset
  static const char resval_on [];       // boolean options switched on
  static const char resval_off [];      // or off

  log_callback   *log_hook;             // log error messages through this hook, if != 0
  getfd_callback *getfd_hook;           // convert remote to local fd, if != 0
  #if ENABLE_PERL
  rxvt_perl_term  perl;
  #endif
  struct mbstate  mbstate;              // current input multibyte state

  unsigned char   want_refresh:1,
  current_screen:1,	// primary or secondary              
  num_scr_allow:1,
  bypass_keystate:1,
  #if ENABLE_FRILLS
  urgency_hint:1,
  #endif
  #if CURSOR_BLINK
  hidden_cursor:1,
  #endif
  #if TEXT_BLINK
  hidden_text:1,
  #endif
  #if POINTER_BLANK
  hidden_pointer:1,
  #endif
  enc_utf8:1,		// wether locale uses utf-8 
  seen_input:1,         // wether we have seen some program output yet 
  seen_resize:1,	// wether we had a resize event 
  parsed_geometry:1;

  unsigned char   refresh_type,
  #ifdef META8_OPTION
  meta_char,            // Alt-key prefix 
  #endif
  selection_wait,
  selection_type;
  // ---------- 
  bool            rvideo_state, rvideo_mode;
  #ifndef NO_BELL
  bool            rvideo_bell;
  #endif
  int             num_scr;              // screen: number lines scrolled 
  int             prev_ncol,            // screen: previous number of columns 
  prev_nrow;            // screen: previous number of rows 
  // ---------- 
  rend_t          rstyle;
  // ---------- 
  #ifdef SELECTION_SCROLLING
  int             scroll_selection_lines;
  enum page_dirn  scroll_selection_dir;
  int             selection_save_x,
  selection_save_y,
  selection_save_state;
  #endif
  // ---------- 
  int             csrO,       // Hops - csr offset in thumb/slider to      
                              //   give proper Scroll behaviour            
                              #if defined(MOUSE_WHEEL) && defined(MOUSE_SLIP_WHEELING)
                              mouse_slip_wheel_speed,
                              #endif
                              refresh_count,
                              window_vt_x,
                              window_vt_y,
                              mouse_row,
                              mouse_col,
                              # ifdef POINTER_BLANK
                              pointerBlankDelay,
                              # endif
                              allowedxerror;
                              // ---------- 
                              unsigned int    ModLevel3Mask,
                              ModMetaMask,
                              ModNumLockMask;
                              int             old_width,  // last used width in screen resize          
                              old_height; // last used height in screen resize         
                              unsigned long   priv_modes,
                              SavedModes;
                              // ---------- 
                              Atom            *xa;
                              // ---------- 
                              Time            selection_time,
                              selection_request_time;
                              pid_t           cmd_pid;    // process id of child 
                              char *          incr_buf;
                              size_t          incr_buf_size, incr_buf_fill;
                              // ---------- 
                              struct mouse_event MEvent;
                              XComposeStatus  compose;
                              struct termios  tio;
                              row_col_t       oldcursor;
                              #ifdef HAVE_BG_PIXMAP
                              bgPixmap_t      bgPixmap;
                              #endif
                              #ifdef HAVE_AFTERIMAGE
                              ASVisual       *asv;
                              ASImageManager *asimman;

                              void init_asv ()
                              {
                              if (!asv)
                              asv = create_asvisual_for_id (dpy, display->screen, depth, XVisualIDFromVisual (visual), cmap, NULL);
                              }
                              #endif

                              #if ENABLE_OVERLAY
                              overlay_base ov;

                              void scr_swap_overlay () NOTHROW;
                              void scr_overlay_new (int x, int y, int w, int h) NOTHROW;
                              void scr_overlay_off () NOTHROW;
                              void scr_overlay_set (int x, int y,
                              text_t text,
                              rend_t rend = OVERLAY_RSTYLE) NOTHROW;
                              void scr_overlay_set (int x, int y, const char *s) NOTHROW;
                              void scr_overlay_set (int x, int y, const wchar_t *s) NOTHROW;
                              #endif

                              vector<void *> allocated;           // free these memory blocks with free()

                              char            env_windowid[21];   // environmental variable WINDOWID 
                              char            env_colorfgbg[sizeof ("COLORFGBG=default;default;bg") + 1];
                              char           *env_display;        // environmental variable DISPLAY  
                              char           *env_term;           // environmental variable TERM     

                              char           *locale;
                              char            charsets[4];
                              char           *v_buffer;           // pointer to physical buffer 
                              unsigned int    v_buflen;           // size of area to write 
                              stringvec      *argv, *envv;        // if != 0, will be freed at destroy time 

                              #ifdef KEYSYM_RESOURCE
                              keyboard_manager *keyboard;
                              #endif
                              #ifndef NO_RESOURCES
                              XrmDatabase option_db;
                              #endif

                              const char     *rs[NUM_RESOURCES];
                              // command input buffering 
                              char           *cmdbuf_ptr, *cmdbuf_endp;
                              char            cmdbuf_base[CBUFSIZ];

                              ptytty         *pty;

                              rxvt_salloc    *talloc;             // text line allocator
                              rxvt_salloc    *ralloc;             // rend line allocator

                              static vector<rxvt_term *> termlist; // a vector of all running rxvt_term's

                              #if ENABLE_FRILLS || ISO_14755
                              // ISO 14755 entry support
                              unicode_t iso14755buf;
                              void commit_iso14755 ();
                              # if ISO_14755
                              void iso14755_51 (unicode_t ch, rend_t r = DEFAULT_RSTYLE, int x = 0, int y = -1);
                              void iso14755_54 (int x, int y);
                              # endif
                              #endif

                              long vt_emask, vt_emask_perl, vt_emask_xim, vt_emask_mouse;

                              void vt_select_input () const NOTHROW
                              {
                              XSelectInput (dpy, vt, vt_emask | vt_emask_perl | vt_emask_xim | vt_emask_mouse);
                              }

                              #if ENABLE_TRANSPARENCY || ENABLE_PERL
                              void rootwin_cb (XEvent &xev);
                              xevent_watcher rootwin_ev;
                              #endif
                              #ifdef HAVE_BG_PIXMAP
                              void update_background ();
                              #if TRACE_PIXMAPS
                              void trace_update_background (const char *file, int line);
                              # define update_background() trace_update_background (__FILE__, __LINE__)
                              #endif
                              void update_background_cb (ev::timer &w, int revents);
                              ev::timer update_background_ev;
                              #endif

                              void x_cb (XEvent &xev);
                              xevent_watcher termwin_ev;
                              xevent_watcher vt_ev;
                              xevent_watcher scrollbar_ev;

                              void child_cb (ev::child &w, int revents); ev::child child_ev;
                              void destroy_cb (ev::idle &w, int revents); ev::idle destroy_ev;
                              void refresh_check ();
                              void flush ();
                              void flush_cb (ev::timer &w, int revents); ev::timer flush_ev;
                              bool pty_fill ();
                              void pty_cb (ev::io &w, int revents); ev::io pty_ev;
                              void incr_cb (ev::timer &w, int revents) NOTHROW; ev::timer incr_ev;

                              #ifdef CURSOR_BLINK
                              void cursor_blink_cb (ev::timer &w, int revents); ev::timer cursor_blink_ev;
                              #endif
                              #ifdef TEXT_BLINK
                              void text_blink_cb (ev::timer &w, int revents); ev::timer text_blink_ev;
                              #endif
                              #ifndef NO_BELL
                              void bell_cb (ev::timer &w, int revents); ev::timer bell_ev;
                              #endif

                              #ifndef NO_SCROLLBAR_BUTTON_CONTINUAL_SCROLLING
                              void cont_scroll_cb (ev::timer &w, int revents); ev::timer cont_scroll_ev;
                              #endif
                              #ifdef SELECTION_SCROLLING
                              void sel_scroll_cb (ev::timer &w, int revents); ev::timer sel_scroll_ev;
                              #endif
                              #if defined(MOUSE_WHEEL) && defined(MOUSE_SLIP_WHEELING)
                              void slip_wheel_cb (ev::timer &w, int revents); ev::timer slip_wheel_ev;
                              #endif

                              #ifdef POINTER_BLANK
                              void pointer_cb (ev::timer &w, int revents); ev::timer pointer_ev;
                              void pointer_blank ();
                              #endif
                              void pointer_unblank ();

                              void tt_printf (const char *fmt,...);
                              void tt_write (const char *data, unsigned int len);
                              void pty_write ();

                              void init (stringvec *argv, stringvec *envv)
                              {
                              this->argv = argv;
                              init (argv->size (), argv->begin (), envv);
                              }

                              void make_current () const // make this the "currently active" urxvt instance
                              {
                              SET_R (this);
                              set_environ (envv);
                              rxvt_set_locale (locale);
                              }

                              #if USE_XIM
                              rxvt_xim *input_method;
                              XIC      Input_Context;
                              XIMStyle input_style;
                              XPoint   spot; // most recently sent spot position

                              void im_destroy ();
                              void im_cb (); im_watcher im_ev;
                              void im_set_size (XRectangle &size);
                              void im_set_position (XPoint &pos) NOTHROW;
                              void im_set_color (unsigned long &fg, unsigned long &bg);
                              void im_set_preedit_area (XRectangle &preedit_rect, XRectangle &status_rect, const XRectangle &needed_rect);

                              bool IMisRunning ();
                              void IMSendSpot ();
                              bool IM_get_IC (const char *modifiers);
                              void IMSetPosition ();
                              #endif

                              // command.C
                              void key_press (XKeyEvent &ev);
                              void key_release (XKeyEvent &ev);
                              unsigned int cmd_write (const char *str, unsigned int count);

                              wchar_t next_char () NOTHROW;
                              wchar_t cmd_getc () THROW ((class out_of_input));
                              uint32_t next_octet () NOTHROW;
                              uint32_t cmd_get8 () THROW ((class out_of_input));

                              void cmd_parse ();
                              void mouse_report (XButtonEvent &ev);
                              void button_press (XButtonEvent &ev);
                              void button_release (XButtonEvent &ev);
                              void focus_in ();
                              void focus_out ();
                              #if ENABLE_FRILLS
                              void set_urgency (bool enable);
                              #else
                              void set_urgency (bool enable) { }
                              #endif
                              void update_fade_color (unsigned int idx);
                              #ifdef PRINTPIPE
                              FILE *popen_printer ();
                              int pclose_printer (FILE *stream);
                              #endif
                              void process_print_pipe ();
                              void process_nonprinting (unicode_t ch);
                              void process_escape_vt52 (unicode_t ch);
                              void process_escape_seq ();
                              void process_csi_seq ();
                              void process_window_ops (const int *args, unsigned int nargs);
                              char *get_to_st (unicode_t &ends_how);
                              void process_dcs_seq ();
                              void process_osc_seq ();
                              void process_color_seq (int report, int color, const char *str, char resp);
                              void process_xterm_seq (int op, const char *str, char resp);
                              int privcases (int mode, unsigned long bit);
                              void process_terminal_mode (int mode, int priv, unsigned int nargs, const int *arg);
                              void process_sgr_mode (unsigned int nargs, const int *arg);
                              void process_graphics ();
                              // init.C
                              void init_vars ();
                              const char **init_resources (int argc, const char *const *argv);
                              void init (int argc, const char *const *argv, stringvec *envv);
                              void init_env ();
                              void set_locale (const char *locale);
                              void init_xlocale ();
                              void init_command (const char *const *argv);
                              void run_command (const char *const *argv);
                              int run_child (const char *const *argv);
                              void color_aliases (int idx);
                              void create_windows (int argc, const char *const *argv);
                              void get_colours ();
                              void get_ourmods ();
                              // main.C
                              void tt_winch ();
                              rxvt_term ();
                              ~rxvt_term ();
                              void destroy ();
                              void emergency_cleanup ();
                              void recolour_cursor ();
                              void resize_all_windows (unsigned int newwidth, unsigned int newheight, int ignoreparent);
                              void window_calc (unsigned int newwidth, unsigned int newheight);
                              bool set_fonts ();
                              void set_string_property (Atom prop, const char *str, int len = -1);
                              void set_utf8_property (Atom prop, const char *str, int len = -1);
                              void set_title (const char *str);
                              void set_icon_name (const char *str);
                              void set_window_color (int idx, const char *color);
                              void set_colorfgbg ();
                              bool set_color (rxvt_color &color, const char *name);
                              void alias_color (int dst, int src);
                              void set_widthheight (unsigned int newwidth, unsigned int newheight);
                              void get_window_origin (int &x, int &y);
                              Pixmap get_pixmap_property (int prop_id);

                              // screen.C

                              void lalloc (line_t &l) const
                              {
                              l.t = (text_t *)talloc->alloc ();
                              l.r = (rend_t *)ralloc->alloc ();
                              }

                              #if 0
                              void lfree (line_t &l)
                              {
                              talloc->free (l.t);
                              ralloc->free (l.r);
                              }
                              #endif

                              void lresize (line_t &l) const
                              {
                              if (!l.t)
                              return;

                              l.t = (text_t *)talloc->alloc (l.t, prev_ncol * sizeof (text_t));
                              l.r = (rend_t *)ralloc->alloc (l.r, prev_ncol * sizeof (rend_t));

                              l.l = min (l.l, ncol);

                              if (ncol > prev_ncol)
                              scr_blank_line (l, prev_ncol, ncol - prev_ncol, DEFAULT_RSTYLE);
                              }

                              int fgcolor_of (rend_t r) const NOTHROW
                              {
                              int base = GET_BASEFG (r);
                              //
                              #ifndef NO_BRIGHTCOLOR
                              if (r & RS_Bold
                              # if ENABLE_STYLES
                              && option (Opt_intensityStyles)
                              # endif
                              && IN_RANGE_INC (base, minCOLOR, minBrightCOLOR))
                              base += minBrightCOLOR - minCOLOR;
                              #endif

                              return base;
                              }

                              int bgcolor_of (rend_t r) const NOTHROW
                              {
                              int base = GET_BASEBG (r);
                              #ifndef NO_BRIGHTCOLOR
                              if (r & RS_Blink
                              # if ENABLE_STYLES
                              && option (Opt_intensityStyles)
                              # endif
                              && IN_RANGE_INC (base, minCOLOR, minBrightCOLOR))
                              base += minBrightCOLOR - minCOLOR;
                              #endif
                              return base;
                              }

                              bool option (uint8_t opt) const NOTHROW
                              {
                              if (!opt)
                              return 0;

                              --opt;
                              return options[opt >> 3] & (1 << (opt & 7));
                              }

                              void set_option (uint8_t opt, bool set = true) NOTHROW
                              {
                              if (!opt)
                              return;

                              --opt;
                              if (set)
                              options[opt >> 3] |= (1 << (opt & 7));
                              else
                              options[opt >> 3] &= ~(1 << (opt & 7));
                              }

                              void set_privmode (unsigned bit, int set) NOTHROW
                              {
                              if (set)
                              priv_modes |= bit;
                              else
                              priv_modes &= ~bit;
                              }

                              // modifies first argument(!)
                              void paste (char *data, unsigned int len) NOTHROW;
                              void scr_blank_line (line_t &l, unsigned int col, unsigned int width, rend_t efs) const NOTHROW;
                              void scr_blank_screen_mem (line_t &l, rend_t efs) const NOTHROW;
                              void scr_kill_char (line_t &l, int col) const NOTHROW;
                              int scr_scroll_text (int row1, int row2, int count) NOTHROW;
                              void scr_reset ();
                              void scr_release () NOTHROW;
                              void scr_clear (bool really = false) NOTHROW;
                              void scr_refresh () NOTHROW;
                              bool scr_refresh_rend (rend_t mask, rend_t value) NOTHROW;
                              void scr_erase_screen (int mode) NOTHROW;
                              #if ENABLE_FRILLS
                              void scr_erase_savelines () NOTHROW;
                              void scr_backindex () NOTHROW;
                              void scr_forwardindex () NOTHROW;
                              #endif
                              void scr_touch (bool refresh) NOTHROW;
                              void scr_expose (int x, int y, int width, int height, bool refresh) NOTHROW;
                              void scr_recolour () NOTHROW;
                              void scr_remap_chars () NOTHROW;
                              void scr_remap_chars (line_t &l) NOTHROW;

                              enum cursor_mode { SAVE, RESTORE };

                              void scr_poweron ();
                              void scr_soft_reset () NOTHROW;
                              void scr_cursor (cursor_mode mode) NOTHROW;
                              void scr_do_wrap () NOTHROW;
                              void scr_swap_screen () NOTHROW;
                              void scr_change_screen (int scrn);
                              void scr_color (unsigned int color, int fgbg) NOTHROW;
                              void scr_rendition (int set, int style) NOTHROW;
                              void scr_add_lines (const wchar_t *str, int len, int minlines = 0) NOTHROW;
                              void scr_backspace () NOTHROW;
                              void scr_tab (int count, bool ht = false) NOTHROW;
                              void scr_gotorc (int row, int col, int relative) NOTHROW;
                              void scr_index (enum page_dirn direction) NOTHROW;
                              void scr_erase_line (int mode) NOTHROW;
                              void scr_E () NOTHROW;
                              void scr_insdel_lines (int count, int insdel) NOTHROW;
                              void scr_insdel_chars (int count, int insdel) NOTHROW;
                              void scr_scroll_region (int top, int bot) NOTHROW;
                              void scr_cursor_visible (int mode) NOTHROW;
                              void scr_autowrap (int mode) NOTHROW;
                              void scr_relative_origin (int mode) NOTHROW;
                              void scr_insert_mode (int mode) NOTHROW;
                              void scr_set_tab (int mode) NOTHROW;
                              void scr_rvideo_mode (bool on) NOTHROW;
                              void scr_report_position () NOTHROW;
                              void set_font_style () NOTHROW;
                              void scr_charset_choose (int set) NOTHROW;
                              void scr_charset_set (int set, unsigned int ch) NOTHROW;
                              void scr_move_to (int y, int len) NOTHROW;
                              bool scr_page (enum page_dirn direction, int nlines) NOTHROW;
                              bool scr_changeview (int new_view_start) NOTHROW;
                              void scr_bell () NOTHROW;
                              void scr_printscreen (int fullhist) NOTHROW;
                              void scr_xor_rect (int beg_row, int beg_col, int end_row, int end_col, rend_t rstyle1, rend_t rstyle2) NOTHROW;
                              void scr_xor_span (int beg_row, int beg_col, int end_row, int end_col, rend_t rstyle) NOTHROW;
                              void scr_reverse_selection () NOTHROW;
                              void scr_dump (int fd) NOTHROW;

                              void selection_check (int check_more) NOTHROW;
                              void selection_paste (Window win, Atom prop, bool delete_prop) NOTHROW;
                              void selection_property (Window win, Atom prop) NOTHROW;
                              void selection_request (Time tm, int selnum = Sel_Primary) NOTHROW;
                              int selection_request_other (Atom target, int selnum) NOTHROW;
                              void selection_clear () NOTHROW;
                              void selection_make (Time tm);
                              bool selection_grab (Time tm) NOTHROW;
                              void selection_start_colrow (int col, int row) NOTHROW;
                              void selection_delimit_word (enum page_dirn dirn, const row_col_t *mark, row_col_t *ret) NOTHROW;
                              void selection_extend_colrow (int32_t col, int32_t row, int button3, int buttonpress, int clickchange) NOTHROW;
                              void selection_remove_trailing_spaces () NOTHROW;
                              void selection_send (const XSelectionRequestEvent &rq) NOTHROW;
                              void selection_click (int clicks, int x, int y) NOTHROW;
                              void selection_extend (int x, int y, int flag) NOTHROW;
                              void selection_rotate (int x, int y) NOTHROW;

                              // xdefaults.C
                              void get_options (int argc, const char *const *argv);
                              int parse_keysym (const char *str, const char *arg);
                              const char *x_resource (const char *name);
                              void extract_resources ();
                              };
*/
#endif // _RXVT_H_ 

