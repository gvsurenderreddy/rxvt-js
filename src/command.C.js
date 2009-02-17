/*----------------------------------------------------------------------*
 * File:	command.C 
 *----------------------------------------------------------------------* 
 *
 * All portions of code are copyright by their respective author/s. 
 * Copyright (c) 1992      John Bovey, University of Kent at Canterbury <jdb@ukc.ac.uk> 
 *				- original version 
 * Copyright (c) 1994      Robert Nation <nation@rocket.sanders.lockheed.com> 
 * 				- extensive modifications 
 * Copyright (c) 1995      Garrett D'Amore <garrett@netcom.com> 
 *				- vt100 printing 
 * Copyright (c) 1995      Steven Hirsch <hirsch@emba.uvm.edu> 
 *				- X11 mouse report mode and support for 
 *				  DEC "private mode" save/restore functions. 
 * Copyright (c) 1995      Jakub Jelinek <jj@gnu.ai.mit.edu> 
 *				- key-related changes to handle Shift+function 
 *				  keys properly. 
 * Copyright (c) 1997      MJ Olesen <olesen@me.queensu.ca> 
 *				- extensive modifications 
 * Copyright (c) 1997      Raul Garcia Garcia <rgg@tid.es> 
 *				- modification and cleanups for Solaris 2.x 
 *				  and Linux 1.2.x 
 * Copyright (c) 1997,1998 Oezguer Kesim <kesim@math.fu-berlin.de> 
 * Copyright (c) 1998-2001 Geoff Wing <gcw@pobox.com> 
 * 				- extensive modifications 
 * Copyright (c) 1998      Alfredo K. Kojima <kojima@windowmaker.org> 
 * Copyright (c) 2001      Marius Gedminas 
 *				- Ctrl/Mod4+Tab works like Meta+Tab (options) 
 * Copyright (c) 2003      Rob McMullen <robm@flipturn.org> 
 * Copyright (c) 2003-2007 Marc Lehmann <pcg@goof.com> 
 * Copyright (c) 2007      Emanuele Giaquinta <e.giaquinta@glauco.it> 
 *
 * This program is free software; you can redistribute it and/or modify 
 * it under the terms of the GNU General Public License as published by 
 * the Free Software Foundation; either version 2 of the License, or 
 * (at your option) any later version. 
 *
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 * GNU General Public License for more details. 
 *
 * You should have received a copy of the GNU General Public License 
 * along with this program; if not, write to the Free Software 
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA. 

 *** in emacs I used the following keyboard macros to fix misedits from my regular expressions
I bound them to "C-H u" "C-H o" and "C-H p"
(fset 'paddy-inline-CMNT
   (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ([134217830 134217826 1 19 94 124 13 134217830 134217826 11 14 32 47 47 25 32 32 32 32 32 32 32 16 1 134217830 6 67108896 19 94 124 13 2 2 2 24 11 14 5 35 35 35 32 25 16 1 11 11 14] 0 "%d")) arg)))
(fset 'paddy-next-pointer
   (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ("piointer" 0 "%d")) arg)))
(fset 'un_cmnt
   (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ([1 5 1 19 94 124 13 11 return 25 16 1 11 11 14 11 11 16 tab 14] 0 "%d")) arg)))

;; my regex finds any instance of "int" and removes it, even in cases such as print which become pr -- this is bad, so here is a macro to find such occasions
(fset 'paddy-next-unwarranted-c-keyword-int
   (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ("\223c_keyword.*int" 0 "%d")) arg)))

 *----------------------------------------------------------------------*/ 

/*{{{ includes: */
#include "../config.h"
#include "rxvt.h"
#include "rxvtperl.h"
#include "version.h"
#include "command.h"

#ifdef KEYSYM_RESOURCE
# include "keyboard.h"
#endif

#include <csignal>

#if LINUX_YIELD_HACK
# include <ctime>
#endif

/*----------------------------------------------------------------------*/

#define IS_CONTROL(ch) !((ch) & 0xffffff60UL)

#if ENABLE_FRILLS || ISO_14755

#define ISO_14755_STARTED	0x80000000UL
#define ISO_14755_51		0x40000000UL // basic (section 5.1)
#define ISO_14755_52		0x20000000UL // keycap (section 5.2)
#define ISO_14755_54		0x10000000UL // code feedback (section 5.4)
#define ISO_14755_MASK		0x0fffffffUL

#if ISO_14755
//CMNT: c_keyword ^|       static unsigned short iso14755_symtab[] = { 
   iso14755_symtab[] = {
  // keysym,		unicode
  XK_Left,		0x2190,
  XK_KP_Left,		0x2190,
  XK_Up,		0x2191,
  XK_KP_Up,		0x2191,
  XK_Right,		0x2192,
  XK_KP_Right,		0x2192,
  XK_Down,		0x2193,
  XK_KP_Down,		0x2193,
  XK_Linefeed,		0x21b4,
  XK_Return,		0x21b5,
  XK_KP_Enter,		0x21b5,

  XK_Prior,		0x21de,
  XK_Next,		0x21df,
  XK_Tab,		0x21e5,
  XK_ISO_Left_Tab,	0x21e6,
  XK_Shift_L,		0x21e7,
  XK_Shift_R,		0x21e7,

  XK_Shift_Lock,	0x21eb,
  XK_ISO_Lock,		0x21eb,
  XK_Caps_Lock,		0x21ec,
  XK_Num_Lock,		0x21ed,
  XK_ISO_Level3_Shift,	0x21ee,
  XK_ISO_Level3_Lock,	0x21ef,
  XK_ISO_Group_Lock,	0x21f0,
  XK_Home,		0x21f1,
  XK_End,		0x21f2,

  XK_Execute,		0x2318,
  XK_Begin,		0x2320,
  XK_Delete,		0x2326,
  XK_Clear,		0x2327,
  XK_BackSpace,		0x232b,
  XK_Insert,		0x2380,
  XK_Control_L,		0x2388,
  XK_Control_R,		0x2388,
  XK_Pause,		0x2389,
  XK_Break,		0x238a,
  XK_Escape,		0x238b,
  XK_Undo,		0x238c,
  XK_Print,		0x2399, 

  XK_space,		0x2423,

#ifdef XK_KP_Begin
  XK_KP_Prior,		0x21de,
  XK_KP_Next,		0x21df,
  XK_KP_Begin,		0x2320,
  XK_KP_Insert,		0x2380,
  XK_KP_Delete,		0x2326,
  XK_KP_Space,		0x2422,
#endif
  0,
};

//CMNT: c_keyword ^|       void 

//CMNT: c_keyword ^|       rxvt_term::iso14755_54 (int x, int y){ 
rxvt_term::iso14755_54 ( x,  y){
  x = Pixel2Col (x);
  y = Pixel2Row (y);

  if (!IN_RANGE_EXC (x, 0, ncol)
      || !IN_RANGE_EXC (y, 0, nrow))
    return;

  for (;;){
//CMNT: c_keyword ^|             const line_t &l = ROW(y + view_start); 
       line_t &l = ROW(y + view_start);

      text_t t = l.t[x];

      if (t != NOCHAR || !x){
          iso14755_51 (l.t[x], l.r[x], x, y);
          iso14755buf = ISO_14755_54;
          break;
        }

      x--;
    }
}

//CMNT: c_keyword ^|       void 

//CMNT: c_keyword ^|       rxvt_term::iso14755_51 (unicode_t ch, rend_t r, int x, int y){ 
rxvt_term::iso14755_51 (ch,  r,  x,  y){
//CMNT: possible_pointer ^|         rxvt_fontset *fs = FONTSET (r); 
  rxvt_fontset  f s = FONTSET (r);
//CMNT: possible_pointer ^|         rxvt_font *f = (*fs)[fs->find_font (ch)]; 
  rxvt_font  f  = ( f s)[fs->find_font (ch)];
//CMNT: c_keyword possible_pointer ^|         wchar_t *chr, *alloc, ch2, *fname; 
    c hr,  a lloc, ch2,  f name;
//CMNT: c_keyword ^|         int len; 
   len;

  fname = rxvt_utf8towcs (f->name);

# if ENABLE_COMBINING
  if (IS_COMPOSE (ch)){
      len = rxvt_composite.expand (ch, 0);
//CMNT: c_keyword ^|             alloc = chr = new wchar_t[len]; 
      alloc = chr = new [len];
      rxvt_composite.expand (ch, chr);
    }
  else
# endif
    {
      ch2 = ch;

      alloc = 0;
      chr = &ch2;
      len = 1;
    }

//CMNT: c_keyword ^|         char attr[80]; // plenty 
   attr[80]; // plenty

   sprintf (attr, "%08x = fg %d bg %d%s%s%s%s%s%s", 
//CMNT: remove_casts ^|                  (int)r, 
           r,
           fgcolor_of (r), bgcolor_of (r),
           r & RS_Bold    ? " bold"    : "",
           r & RS_Italic  ? " italic"  : "",
           r & RS_Blink   ? " blink"   : "",
           r & RS_RVid    ? " rvid"    : "",
           r & RS_Uline   ? " uline"   : "",
           r & RS_Careful ? " careful" : "");

//CMNT: js_style_variables ^|         int width = wcswidth (fname, wcslen (fname)); 
 var width= wcswidth (fname, wcslen (fname)); 

//CMNT: c_keyword ^|         max_it (width, 8+5); // for char + hex 
  max_it (width, 8+5); // for  + hex
  max_it (width, strlen (attr));

  if (y >= 0){
      y = (y >= nrow - len - 4 && x < width + 2) ? 0 : -1;
      x = 0;
    }

  scr_overlay_new (x, y, width, len + 2);

  r = SET_STYLE (OVERLAY_RSTYLE, GET_STYLE (r));

//CMNT: c_keyword ^|         for (int y = 0; y < len; y++){ 
  for ( y = 0; y < len; y++){
//CMNT: c_keyword ^|             char buf[9]; 
       buf[9];

//CMNT: possible_pointer ^|             ch = *chr++; 
      ch =  c hr++;

      sprintf (buf, "%8x", ch); 
      scr_overlay_set (0, y, buf);
      scr_overlay_set (9, y, '=');
# if !UNICODE_3
      if (ch >= 0x10000)
        ch = 0xfffd;
# endif
      scr_overlay_set (11, y, ch, r);

      if (WCWIDTH (ch) >= 2)
        scr_overlay_set (12, y, NOCHAR, r);
    }

//  {
//CMNT: c_keyword ^|       //    char buf[4+4+3+1]; 
//     buf[4+4+3+1];
  //    snprintf (buf, sizeof (buf), "(%.4d|%.4d)", x, y); 
//    scr_overlay_set (0, 0, buf);
//  }
  scr_overlay_set (0, len    , attr);
  scr_overlay_set (0, len + 1, fname);

  free (fname);

# if ENABLE_COMBINING
  if (alloc)
    delete [] alloc;
# endif
}
#endif

//CMNT: c_keyword ^|       void 

rxvt_term::commit_iso14755 (){
//CMNT: c_keyword ^|         wchar_t ch[2]; 
   ch[2];

  ch[0] = iso14755buf & ISO_14755_MASK;
  ch[1] = 0;

  if (iso14755buf & ISO_14755_51){
//CMNT: c_keyword ^|             char mb[16]; 
       mb[16];
//CMNT: c_keyword ^|             int len; 
       len;

      // allow verbatim 0-bytes and control-bytes to be entered
      if (ch[0] >= 0x20)
        len = wcstombs (mb, ch, 16);
      else{
          mb[0] = ch[0];
          len = 1;
        }

      if (len > 0)
        tt_write (mb, len);
      else
        scr_bell ();
    }

  iso14755buf = 0;
}

//CMNT: c_keyword ^|       static int  //FIXME 
 
hex_keyval (XKeyEvent &ev){
  // check wether this event corresponds to a hex digit
  // if the modifiers had not been pressed.
//CMNT: c_keyword ^|         for (int index = 0; index < 8; index++){ 
  for ( index = 0; index < 8; index++){
      KeySym k = XLookupKeysym (&ev, index);

      if (k >= XK_KP_0 && k <= XK_KP_9) return k - XK_KP_0;
      else if (k >= XK_0 && k <= XK_9)  return k - XK_0;
      else if (k >= XK_a && k <= XK_f)  return k - XK_a + 10;
      else if (k >= XK_A && k <= XK_F)  return k - XK_A + 10;
    }

  return -1;
}
#endif

//CMNT: c_keyword ^|       static inline KeySym 
 inline KeySym
translate_keypad (KeySym keysym, bool kp){
#ifdef XK_KP_Home
//CMNT: c_keyword ^|         static const KeySym keypadtrans[] = { 
    KeySym keypadtrans[] = {
    XK_KP_7, // XK_KP_Home
    XK_KP_4, // XK_KP_Left
    XK_KP_8, // XK_KP_Up
    XK_KP_6, // XK_KP_Right
    XK_KP_2, // XK_KP_Down
# ifndef UNSHIFTED_SCROLLKEYS
    XK_KP_9, // XK_KP_Prior
    XK_KP_3, // XK_KP_Next
# else
    XK_Prior,
    XK_Next,
# endif
    XK_KP_1, // XK_KP_End
    XK_KP_5, // XK_KP_Begin
  };

  if (IN_RANGE_INC (keysym, XK_KP_Home, XK_KP_Begin)){
//CMNT: c_keyword ^|             unsigned int index = keysym - XK_KP_Home; 
        index = keysym - XK_KP_Home;
      keysym = kp ? keypadtrans[index] : XK_Home + index;
    }
  else if (keysym == XK_KP_Insert)
    keysym = kp ? XK_KP_0 : XK_Insert;
# ifndef NO_DELETE_KEY
  else if (keysym == XK_KP_Delete)
    keysym = kp ? XK_KP_Decimal : XK_Delete;
# endif
#endif
  return keysym;
}

//CMNT: c_keyword ^|       static inline int  //FIXME 
 inline 
map_function_key (KeySym keysym){
//CMNT: js_style_variables ^|         int param = 0; 
 var param= 0; 

  if (IN_RANGE_INC (keysym, XK_F1, XK_F35)){
      param = 11 + keysym - XK_F1;
      if (keysym >= XK_F17)
        param += 4;
      else if (keysym >= XK_F15)
        param += 3;
      else if (keysym >= XK_F11)
        param += 2;
      else if (keysym >= XK_F6)
        param += 1;
    }
  else
    switch (keysym){
        case XK_Find:
          param = 1;
          break;
        case XK_Insert:
          param = 2;
          break;
#ifdef DXK_Remove
        case DXK_Remove:
#endif
        case XK_Execute:
          param = 3;
          break;
        case XK_Select:
          param = 4;
          break;
#ifndef UNSHIFTED_SCROLLKEYS
        case XK_Prior:
          param = 5;
          break;
        case XK_Next:
          param = 6;
          break;
        case XK_Home:
          param = 7;
          break;
        case XK_End:
          param = 8;
          break;
#endif
        case XK_Help:
          param = 28;
          break;
        case XK_Menu:
          param = 29;
          break;
      }
  return param;
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::key_press (XKeyEvent &ev){ 
rxvt_term.key_press =function(XKeyEvent &ev){ 
//CMNT: c_keyword ^|         int ctrl, meta, shft, len; 
   ctrl, meta, shft, len;
  KeySym keysym;
//CMNT: c_keyword ^|         int valid_keysym; 
   valid_keysym;
//CMNT: c_keyword ^|         char kbuf[KBUFSZ]; 
   kbuf[KBUFSZ];

#if ISO_14755
  if (iso14755buf & ISO_14755_52)
    return;
#endif

  /*
   * use Num_Lock to toggle Keypad on/off.  If Num_Lock is off, allow an 
   * escape sequence to toggle the Keypad. 
   *
   * Always permit `shift' to override the current setting 
   */
  shft = ev.state & ShiftMask;
  ctrl = ev.state & ControlMask;
  meta = ev.state & ModMetaMask;

  if (numlock_state || (ev.state & ModNumLockMask)){
      numlock_state = (ev.state & ModNumLockMask);
      set_privmode (PrivMode_aplKP, !numlock_state);
    }

  kbuf[0] = 0;

#ifdef USE_XIM
  if (Input_Context){
      Status status_return;

#if 0
#ifdef X_HAVE_UTF8_STRING
      if (enc_utf8 && 0) // currently disabled, doesn't seem to work, nor is useful
        len = Xutf8LookupString (Input_Context, &ev, kbuf,
                                 KBUFSZ, &keysym, &status_return);
      else
#endif
#endif
        {
//CMNT: c_keyword ^|                 wchar_t wkbuf[KBUFSZ + 1]; 
           wkbuf[KBUFSZ + 1];

          // the XOpenIM manpage lies about hardcoding the locale
           // at the point of XOpenIM, so temporarily switch locales 
          if (rs[Rs_imLocale])
            SET_LOCALE (rs[Rs_imLocale]);

          // assume wchar_t == unicode or better 
          len = XwcLookupString (Input_Context, &ev, wkbuf,
                                 KBUFSZ, &keysym, &status_return);

          if (rs[Rs_imLocale])
            SET_LOCALE (locale);

          if (status_return == XLookupChars
              || status_return == XLookupBoth){
              /* make sure the user can type ctrl-@, i.e. NUL */
//CMNT: possible_pointer ^|                     if (len == 1 && *wkbuf == 0){ 
              if (len == 1 &&  w kbuf == 0){
                  kbuf[0] = 0;
                  len = 1;
                }
              else{
                  wkbuf[len] = 0;
//CMNT: c_keyword possible_pointer ^|                         len = wcstombs ((char *)kbuf, wkbuf, KBUFSZ); 
                  len = wcstombs ((  ) kbuf, wkbuf, KBUFSZ);
                  if (len < 0)
                    len = 0;
                }
            }
          else
            len = 0;
        }

      valid_keysym = status_return == XLookupKeySym
                     || status_return == XLookupBoth;
    }
  else
#endif
    {
      len = XLookupString (&ev, kbuf, KBUFSZ, &keysym, &compose);
      valid_keysym = keysym != NoSymbol;
    }

  if (valid_keysym){
#ifdef KEYSYM_RESOURCE
      if (keyboard->dispatch (this, keysym, ev.state))
        return;
#endif

      if (saveLines){
#ifdef UNSHIFTED_SCROLLKEYS
          if (!ctrl && !meta)
#else
          if (IS_SCROLL_MOD)
#endif
            {
//CMNT: c_keyword ^|                     int lnsppg; 
               lnsppg;

#ifdef PAGING_CONTEXT_LINES
              lnsppg = nrow - PAGING_CONTEXT_LINES;
#else
//CMNT: possible_pointer ^|                     lnsppg = nrow * 4 / 5; 
              lnsppg = nrow    4 / 5;
#endif
              if (keysym == XK_Prior){
                  scr_page (UP, lnsppg);
                  return;
                }
              else if (keysym == XK_Next){
                  scr_page (DN, lnsppg);
                  return;
                }
            }
#ifdef SCROLL_ON_UPDOWN_KEYS
          if (IS_SCROLL_MOD){
              if (keysym == XK_Up){
                  scr_page (UP, 1);
                  return;
                }
              else if (keysym == XK_Down){
                  scr_page (DN, 1);
                  return;
                }
            }
#endif
#ifdef SCROLL_ON_HOMEEND_KEYS
          if (IS_SCROLL_MOD){
              if (keysym == XK_Home){
                  scr_move_to (0, 1);
                  return;
                }
              else if (keysym == XK_End){
                  scr_move_to (1, 1);
                  return;
                }
            }
#endif
        }

      if (shft){
          /* Shift + F1 - F10 generates F11 - F20 */
          if (keysym >= XK_F1 && keysym <= XK_F10){
              keysym += (XK_F11 - XK_F1);
              shft = 0;	/* turn off Shift */
            }
          else if (!ctrl && !meta && (priv_modes & PrivMode_ShiftKeys)){
              switch (keysym){
                    /* normal XTerm key bindings */
                  case XK_Insert:	/* Shift+Insert = paste mouse selection */
                    selection_request (ev.time);
                    return;
#if TODO
                    /* rxvt extras */
                  case XK_KP_Add:	/* Shift+KP_Add = bigger font */
                    change_font (FONT_UP);
                    return;
                  case XK_KP_Subtract:	/* Shift+KP_Subtract = smaller font */
                    change_font (FONT_DN);
                    return;
#endif
                }
            }
        }

#if ENABLE_FRILLS || ISO_14755
      // ISO 14755 support
      if (shft && ctrl){
//CMNT: c_keyword ^|                 int hv; 
           hv;

          if (iso14755buf & ISO_14755_51
              && (keysym == XK_space || keysym == XK_KP_Space
                  || keysym == XK_Return || keysym == XK_KP_Enter)){
              commit_iso14755 ();
              iso14755buf = ISO_14755_51;
# if ISO_14755
              iso14755_51 (0);
# endif
              return;
            }
          else if (keysym == XK_BackSpace){
              iso14755buf = ((iso14755buf & ISO_14755_MASK) >> 4) | ISO_14755_51;
# if ISO_14755
              iso14755_51 (iso14755buf & ISO_14755_MASK);
# endif
              return;
            }
          else if ((hv = hex_keyval (ev)) >= 0){
              iso14755buf = ((iso14755buf << 4) & ISO_14755_MASK)
                          | hv | ISO_14755_51;
# if ISO_14755
              iso14755_51 (iso14755buf & ISO_14755_MASK);
# endif
              return;
            }
          else{
# if ISO_14755
              scr_overlay_off ();
# endif
              iso14755buf = 0;
            }
        }
      else if ((ctrl && (keysym == XK_Shift_L || keysym == XK_Shift_R))
               || (shft && (keysym == XK_Control_L || keysym == XK_Control_R)))
        if (!(iso14755buf & ISO_14755_STARTED)){
            iso14755buf |= ISO_14755_STARTED;
# if ISO_14755
            scr_overlay_new (0, -1, sizeof ("ISO 14755 mode") - 1, 1);
            scr_overlay_set (0, 0, "ISO 14755 mode");
# endif
          }
#endif

#ifdef PRINTPIPE
      if (keysym == XK_Print){ 
        scr_printscreen (ctrl | shft); 
          return;
        }
#endif

      if (keysym >= 0xFF00 && keysym <= 0xFFFF){
          bool kp = priv_modes & PrivMode_aplKP ? !shft : shft;
//CMNT: c_keyword ^|                 unsigned int newlen = 1; 
            newlen = 1;

          switch (translate_keypad (keysym, kp)){
#ifndef NO_BACKSPACE_KEY
              case XK_BackSpace:
                if (priv_modes & PrivMode_HaveBackSpace){
                    kbuf[0] = (!! (priv_modes & PrivMode_BackSpace)
                               ^ !!ctrl) ? '\b' : '\177';
                    kbuf[1] = '\0';
                  }
                else
                  strcpy (kbuf, rs[Rs_backspace_key]);
                break;
#endif
#ifndef NO_DELETE_KEY
              case XK_Delete:
                strcpy (kbuf, rs[Rs_delete_key]);
                break;
#endif
              case XK_Tab:
                if (shft)
                  strcpy (kbuf, "\033[Z");
                else{
#ifdef CTRL_TAB_MAKES_META
                    if (ctrl)
                      meta = 1;
#endif
#ifdef MOD4_TAB_MAKES_META
                    if (ev.state & Mod4Mask)
                      meta = 1;
#endif
                    newlen = 0;
                  }
                break;

              case XK_Up:	/* "\033[A" */
              case XK_Down:	/* "\033[B" */
              case XK_Right:	/* "\033[C" */
              case XK_Left:	/* "\033[D" */
                strcpy (kbuf, "\033[Z");
                kbuf[2] = "DACB"[keysym - XK_Left];
                /* do Shift first */
                if (shft)
                  kbuf[2] = "dacb"[keysym - XK_Left];
                else if (ctrl){
                    kbuf[1] = 'O';
                    kbuf[2] = "dacb"[keysym - XK_Left];
                  }
                else if (priv_modes & PrivMode_aplCUR)
                  kbuf[1] = 'O';
                break;

              case XK_KP_Enter:
                /* allow shift to override */
                if (kp){
                    strcpy (kbuf, "\033OM");
                    break;
                  }

                /* FALLTHROUGH */

              case XK_Return:
                if (priv_modes & PrivMode_LFNL){
                    kbuf[0] = '\015';
                    kbuf[1] = '\012';
                    kbuf[2] = '\0';
                  }
                else{
                    kbuf[0] = '\015';
                    kbuf[1] = '\0';
                  }
                break;

              case XK_KP_F1:	/* "\033OP" */
              case XK_KP_F2:	/* "\033OQ" */
              case XK_KP_F3:	/* "\033OR" */
              case XK_KP_F4:	/* "\033OS" */
                strcpy (kbuf, "\033OP");
                kbuf[2] += (keysym - XK_KP_F1);
                break;

          case XK_KP_Multiply:	/* "\033Oj" : "*" */ 
              case XK_KP_Add:		/* "\033Ok" : "+" */
              case XK_KP_Separator:	/* "\033Ol" : "," */
              case XK_KP_Subtract:	/* "\033Om" : "-" */
              case XK_KP_Decimal:	/* "\033On" : "." */
              case XK_KP_Divide:	/* "\033Oo" : "/" */
              case XK_KP_0:		/* "\033Op" : "0" */
              case XK_KP_1:		/* "\033Oq" : "1" */
              case XK_KP_2:		/* "\033Or" : "2" */
              case XK_KP_3:		/* "\033Os" : "3" */
              case XK_KP_4:		/* "\033Ot" : "4" */
              case XK_KP_5:		/* "\033Ou" : "5" */
              case XK_KP_6:		/* "\033Ov" : "6" */
              case XK_KP_7:		/* "\033Ow" : "7" */
              case XK_KP_8:		/* "\033Ox" : "8" */
              case XK_KP_9:		/* "\033Oy" : "9" */
                /* allow shift to override */
                if (kp){
                    strcpy (kbuf, "\033Oj");
                    kbuf[2] += (keysym - XK_KP_Multiply);
                  }
                else{
//CMNT: possible_pointer ^|                           kbuf[0] = ('*' + (keysym - XK_KP_Multiply)); 
                    kbuf[0] = (' '  + (keysym - XK_KP_Multiply));
                    kbuf[1] = '\0';
                  }
                break;

              default:
                {
//CMNT: js_style_variables ^|                         int param = map_function_key (keysym); 
 var param= map_function_key (keysym); 
                  if (param > 0)
                    sprintf (kbuf,"\033[%d~", param); 
                  else
                    newlen = 0;
                }
                break;
            }

          if (newlen)
            len = strlen (kbuf);

          /*
           * Pass meta for all function keys, if 'meta' option set 
           */
#ifdef META8_OPTION
//CMNT: c_keyword ^|                 if (meta && (meta_char == 0x80) && len > 0) 
          if (meta && (meta_ == 0x80) && len > 0)
            kbuf[len - 1] |= 0x80;
#endif

        }
      else if (ctrl && keysym == XK_minus){
          len = 1;
          kbuf[0] = '\037';	/* Ctrl-Minus generates ^_ (31) */
        }
      else if (keysym == XK_ISO_Left_Tab){
          strcpy (kbuf, "\033[Z");
          len = 3;
        }
      else{
#ifdef META8_OPTION
          /* set 8-bit on */
//CMNT: c_keyword ^|                 if (meta && (meta_char == 0x80)){ 
          if (meta && (meta_ == 0x80)){
//CMNT: c_keyword possible_pointer ^|                     char *ch; 
                c h;

              for (ch = kbuf; ch < kbuf + len; ch++)
//CMNT: possible_pointer ^|                       *ch |= 0x80; 
                 c h |= 0x80;

              meta = 0;
            }
#endif
          /* nil */ ;
        }
    }

  if (HOOK_INVOKE ((this, HOOK_KEY_PRESS, DT_XEVENT, &ev, DT_INT, keysym, DT_STR_LEN, kbuf, len, DT_END)))
    return;

  if (len <= 0)
    return;			/* not mapped */

  if (option (Opt_scrollTtyKeypress))
    if (view_start){
        view_start = 0;
        want_refresh = 1;
      }

  /*
   * these modifications only affect the static keybuffer 
   * pass Shift/Control indicators for function keys ending with `~' 
   *
   * eg, 
   *   Prior = "ESC[5~" 
   *   Shift+Prior = "ESC[5$" 
   *   Ctrl+Prior = "ESC[5^" 
   *   Ctrl+Shift+Prior = "ESC[5@" 
   * Meta adds an Escape prefix (with META8_OPTION, if meta == <escape>). 
   */
  if (kbuf[0] == C0_ESC && kbuf[1] == '[' && kbuf[len - 1] == '~')
    kbuf[len - 1] = (shft ? (ctrl ? '@' : '$') : (ctrl ? '^' : '~'));

  /* escape prefix */
  if (meta
#ifdef META8_OPTION
//CMNT: c_keyword ^|             && meta_char == C0_ESC 
      && meta_ == C0_ESC
#endif
     ){
//CMNT: c_keyword ^|             const char ch = C0_ESC; 
        ch = C0_ESC;
      tt_write (&ch, 1);
    }

//CMNT: c_keyword ^|         tt_write (kbuf, (unsigned int)len); 
  tt_write (kbuf, ( )len);
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::key_release (XKeyEvent &ev){ 
rxvt_term.key_release =function(XKeyEvent &ev){ 
#if (MOUSE_WHEEL && MOUSE_SLIP_WHEELING) || ISO_14755 || ENABLE_PERL
  KeySym keysym;

  keysym = XLookupKeysym (&ev, ev.state & ShiftMask ? 1 : 0); // sorry, only shift supported :/
#endif

#if ENABLE_FRILLS || ISO_14755
  // ISO 14755 support
  if (iso14755buf)
    if (iso14755buf & ISO_14755_52){
# if ISO_14755
        scr_overlay_off ();
# endif
# if ISO_14755
        // iso14755 part 5.2 handling: release time
        // first: controls
        if ((ev.state & ControlMask)
             && ((keysym >= 0x40 && keysym <= 0x5f)
                 || (keysym >= 0x61 && keysym <= 0x7f))){
            iso14755buf = ISO_14755_51 | 0x2400 | (keysym & 0x1f);
            commit_iso14755 ();

            return;
          }

//CMNT: c_keyword possible_pointer ^|               for (unsigned short *i = iso14755_symtab; i[0]; i+= 2) 
        for (   i  = iso14755_symtab; i[0]; i+= 2)
          if (i[0] == keysym){
              iso14755buf = ISO_14755_51 | i[1];
              commit_iso14755 ();

              return;
            }

        scr_bell ();
# endif
        iso14755buf = 0;

        return;
      }
    else if ((ev.state & (ShiftMask | ControlMask)) != (ShiftMask | ControlMask)){
# if ISO_14755
        scr_overlay_off ();
# endif
        if (iso14755buf & ISO_14755_51)
          commit_iso14755 ();
#if ISO_14755
        else if (option (Opt_iso14755_52) && iso14755buf & ISO_14755_STARTED){
            iso14755buf = ISO_14755_52; // iso14755 part 5.2: remember empty begin/end pair

            scr_overlay_new (0, -1, sizeof ("KEYCAP PICTURE INSERT MODE") - 1, 1);
            scr_overlay_set (0, 0, "KEYCAP PICTURE INSERT MODE");
          }
# endif
        else
          iso14755buf = 0;
      }
#endif

  if (HOOK_INVOKE ((this, HOOK_KEY_RELEASE, DT_XEVENT, &ev, DT_INT, keysym, DT_END)))
    return;

#if defined(MOUSE_WHEEL) && defined(MOUSE_SLIP_WHEELING)
  if (!(ev.state & ControlMask))
    slip_wheel_ev.stop ();
  else if (keysym == XK_Control_L || keysym == XK_Control_R)
    mouse_slip_wheel_speed = 0;
#endif
}

#if defined (KEYSYM_RESOURCE)
 
//CMNT: js_style_functions c_keyword possible_pointer ^|   unsigned int     rxvt_term::cmd_write (const char *str, unsigned int count){ 
rxvt_term.cmd_write =function(   s tr,   count){ 
//CMNT: c_keyword ^|         unsigned int n, s; 
    n, s;

  n = cmdbuf_ptr - cmdbuf_base;
  s = cmdbuf_base + CBUFSIZ - 1 - cmdbuf_endp;

  if (n > 0 && s < count){
      memmove (cmdbuf_base, cmdbuf_ptr,
//CMNT: c_keyword ^|                     (unsigned int) (cmdbuf_endp - cmdbuf_ptr)); 
              ( ) (cmdbuf_endp - cmdbuf_ptr));
      cmdbuf_ptr = cmdbuf_base;
      cmdbuf_endp -= n;
      s += n;
    }

  if (count > s){
      rxvt_warn ("data loss: cmd_write too large, continuing.\n");
      count = s;
    }

  for (; count--;)
//CMNT: possible_pointer ^|           *cmdbuf_endp++ = *str++; 
     c mdbuf_endp++ =  s tr++;

  cmd_parse ();

  return 0;
}
#endif

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::flush (){ 
rxvt_term.flush =function(){ 
  flush_ev.stop ();

#ifdef HAVE_BG_PIXMAP
  if (bgPixmap.check_clearChanged ()){
//      scr_clear (true); This needs to be researched further!
      scr_touch (false);
    }
#endif

  if (want_refresh){
      if (SHOULD_INVOKE (HOOK_LINE_UPDATE)){
//CMNT: js_style_variables ^|                 int row = view_start; 
 var row= view_start; 
//CMNT: js_style_variables ^|                 int end_row = row + nrow; 
 var end_row= row + nrow; 

          while (row > top_row && ROW (row - 1).is_longer ())
            --row;

          do
            {
//CMNT: js_style_variables ^|                     int start_row = row; 
 var start_row= row; 
//CMNT: possible_pointer ^|                     line_t *l; 
              line_t  l ;

              do
                {
                  l = &ROW (row++);

                  if (!(l->f & LINE_FILTERED)){
                      // line not filtered, mark it as filtered
                      l->f |= LINE_FILTERED;
                      while (l->is_longer ()){
                          l = &ROW (row++);
                          l->f |= LINE_FILTERED;
                        }

                      // and filter it
                      HOOK_INVOKE ((this, HOOK_LINE_UPDATE, DT_INT, start_row, DT_END));

                      break;
                    }
                }
              while (l->is_longer () && row < end_row);
            }
          while (row < end_row);
        }

      scr_refresh ();
      scrollBar.show (1);
#ifdef USE_XIM
      IMSendSpot ();
#endif
    }

  display->flush ();
}

/* checks wether a refresh is requested and starts the refresh timer */
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::refresh_check (){ 
rxvt_term.refresh_check =function(){ 
  if (want_refresh && !flush_ev.is_active ())
    flush_ev.start (1. / 60.); // refresh at max. 60 Hz normally

  display->flush ();
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::flush_cb (ev::timer &w, int revents){ 
rxvt_term.flush_cb =function(ev::timer &w,  revents){ 
  make_current ();

  refresh_count = 0;
  flush ();
}

#ifdef CURSOR_BLINK
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::cursor_blink_cb (ev::timer &w, int revents){ 
rxvt_term.cursor_blink_cb =function(ev::timer &w,  revents){ 
  hidden_cursor = !hidden_cursor;
  want_refresh = 1;
  refresh_check ();
}
#endif

#ifdef TEXT_BLINK
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::text_blink_cb (ev::timer &w, int revents){ 
rxvt_term.text_blink_cb =function(ev::timer &w,  revents){ 
  if (scr_refresh_rend (RS_Blink, RS_Blink)){
      hidden_text = !hidden_text;
      want_refresh = 1;
      refresh_check ();
    }
  else
    w.stop ();
}
#endif

#ifndef NO_SCROLLBAR_BUTTON_CONTINUAL_SCROLLING
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::cont_scroll_cb (ev::timer &w, int revents){ 
rxvt_term.cont_scroll_cb =function(ev::timer &w,  revents){ 
  if ((scrollBar.state == STATE_UP || scrollBar.state == STATE_DOWN)
      && scr_page (scrollBar.state == STATE_UP ? UP : DN, 1)){
      want_refresh = 1;
      refresh_check ();
    }
  else
    w.stop ();
}
#endif

#ifdef SELECTION_SCROLLING
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::sel_scroll_cb (ev::timer &w, int revents){ 
rxvt_term.sel_scroll_cb =function(ev::timer &w,  revents){ 
  if (scr_page (scroll_selection_dir, scroll_selection_lines)){
      selection_extend (selection_save_x, selection_save_y, selection_save_state);
      want_refresh = 1;
      refresh_check ();
    }
  else
    w.stop ();
}
#endif

#if defined(MOUSE_WHEEL) && defined(MOUSE_SLIP_WHEELING)
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::slip_wheel_cb (ev::timer &w, int revents){ 
rxvt_term.slip_wheel_cb =function(ev::timer &w,  revents){ 
  if (scr_changeview (view_start - mouse_slip_wheel_speed)){
      want_refresh = 1;
      refresh_check ();
    }

  if (view_start == top_row || view_start == 0 || mouse_slip_wheel_speed == 0){
      mouse_slip_wheel_speed = 0;
      w.stop ();
    }
}
#endif

#if LINUX_YIELD_HACK
//CMNT: c_keyword ^|       static struct event_handler 
 struct event_handler
{
  ev::prepare yield_ev;

//CMNT: c_keyword ^|         void yield_cb (ev::prepare &w, int revents){ 
 yield_cb (ev::prepare &w,  revents){
    // this should really be sched_yield(), but the linux guys thought
    // that giving a process calling sched_yield () less cpu time than
    // ones with high nice levels is a useful thing to do. It surely is is
    // allowed by the sus... as is returning ENOSYS.
    // since the linux guys additionally thought that breaking the only
    // known workaroudn against their unusable sched_yield hack is cool,
    // we just nanosleep a bit and hope for the best.

    struct timespec ts = { 0, 1000 };
    nanosleep (&ts, 0);

    w.stop ();
  }

  event_handler ()
  : yield_ev (this, &event_handler::yield_cb){
  }
} event_handler;
#endif

//CMNT: js_style_functions ^|       bool rxvt_term::pty_fill (){ 
boolrxvt_term.pty_fill =function(){ 
  ssize_t n = cmdbuf_endp - cmdbuf_ptr;

  if (CBUFSIZ == n){
      rxvt_warn ("PLEASE REPORT: pty_fill on full buffer, draining input, continuing.\n");
      n = 0;
    }

  memmove (cmdbuf_base, cmdbuf_ptr, n);
  cmdbuf_ptr = cmdbuf_base;
  cmdbuf_endp = cmdbuf_ptr + n;

  ssize_t r = read (pty->pty, cmdbuf_endp, CBUFSIZ - n);

  if (r > 0){
      cmdbuf_endp += r;
      return true;
    }
  else if (r < 0 && (errno == EAGAIN || errno == EINTR)){
#if LINUX_YIELD_HACK
      if (display->is_local)
        event_handler.yield_ev.start ();
#endif
    }
  else{
      pty_ev.stop ();

      if (!option (Opt_hold))
        destroy ();
    }

  return false;
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::pty_cb (ev::io &w, int revents){ 
rxvt_term.pty_cb =function(ev::io &w,  revents){ 
  make_current ();

  if (revents & ev::READ)
    // loop, but don't allow a single term to monopolize us
//CMNT: c_keyword ^|           for (int i = CBUFCNT; i-- && pty_fill (); ) 
    for ( i = CBUFCNT; i-- && pty_fill (); )
      cmd_parse ();

  if (revents & ev::WRITE)
    pty_write ();

  refresh_check ();
}

  void rxvt_term::pointer_unblank (){ 
  XDefineCursor (dpy, vt, TermWin_cursor);
  recolour_cursor ();

#ifdef POINTER_BLANK
//CMNT: c_keyword ^|         hidden_pointer = 0; 
  hidden_poer = 0;

  if (option (Opt_pointerBlank)) 
    pointer_ev.start (pointerBlankDelay); 
#endif
}

#ifdef POINTER_BLANK
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::pointer_blank (){ 
rxvt_term.pointer_blank =function(){ 
  if (!option (Opt_pointerBlank)) 
    return;

  XDefineCursor (dpy, vt, display->blank_cursor);
  XFlush (dpy);

  hidden_pointer = 1; 
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::pointer_cb (ev::timer &w, int revents){ 
rxvt_term.poer_cb =function(ev::timer &w,  revents){ 
  make_current ();

  pointer_blank (); 
}
#endif

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::mouse_report (XButtonEvent &ev){ 
rxvt_term.mouse_report =function(XButtonEvent &ev){ 
//CMNT: c_keyword ^|         int button_number, key_state = 0; 
   button_number, key_state = 0;
//CMNT: c_keyword ^|         int x, y; 
   x, y;
//CMNT: js_style_variables ^|         int code = 32; 
 var code= 32; 

  x = Pixel2Col (ev.x);
  y = Pixel2Row (ev.y);
  if (ev.type == MotionNotify){
      if (x == mouse_row && y == mouse_col)
        return;
      mouse_row = x;
      mouse_col = y;
      code += 32;
    }

  if (MEvent.button == AnyButton)
    button_number = 3;
  else{
      button_number = MEvent.button - Button1;
      /* add 0x3D for wheel events, like xterm does */
      if (button_number >= 3)
        button_number += (64 - 3);
    }

  if (priv_modes & PrivMode_MouseX10){
      /*
       * do not report ButtonRelease 
       * no state info allowed 
       */
      key_state = 0;
      if (button_number == 3)
        return;
    }
  else{
      /* XTerm mouse reporting needs these values:
       *   4 = Shift 
       *   8 = Meta 
       *  16 = Control 
       * plus will add in our own Double-Click reporting 
       *  32 = Double Click 
       */
      key_state = ((MEvent.state & ShiftMask) ? 4 : 0)
                  + ((MEvent.state & ModMetaMask) ? 8 : 0)
                  + ((MEvent.state & ControlMask) ? 16 : 0);
#ifdef MOUSE_REPORT_DOUBLECLICK
      key_state += ((MEvent.clicks > 1) ? 32 : 0);
#endif
    }

#if DEBUG_MOUSEREPORT
   fprintf (stderr, "Mouse ["); 
  if (key_state & 16)
    fputc ('C', stderr);
  if (key_state & 4)
    fputc ('S', stderr);
  if (key_state & 8)
    fputc ('A', stderr);
  if (key_state & 32)
    fputc ('2', stderr);
   fprintf (stderr, "]: <%d>, %d/%d\n", 
          button_number,
          x + 1,
          y + 1);
#endif

   tt_printf ("\033[M%c%c%c", 
            (code + button_number + key_state),
            (32 + x + 1),
            (32 + y + 1));
}

/*{{{ process an X event */
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::x_cb (XEvent &ev){ 
rxvt_term.x_cb =function(XEvent &ev){ 
  make_current ();

//CMNT: possible_pointer ^|         dLocal (Display *, dpy); 
  dLocal (Display  ,  dpy);

  if (ev.xany.window == vt
      && SHOULD_INVOKE (HOOK_X_EVENT)
      && HOOK_INVOKE ((this, HOOK_X_EVENT, DT_XEVENT, &ev, DT_END)))
    return;

  // for XQueryPointer 
  Window unused_root, unused_child;
//CMNT: c_keyword ^|         int unused_root_x, unused_root_y; 
   unused_root_x, unused_root_y;
//CMNT: c_keyword ^|         unsigned int unused_mask; 
    unused_mask;

  switch (ev.type){
      case KeyPress:
        key_press (ev.xkey);
        break;

      case KeyRelease:
        key_release (ev.xkey);
        break;

      case ButtonPress:
        button_press (ev.xbutton);
        break;

      case ButtonRelease:
        button_release (ev.xbutton);
        break;

      case ClientMessage:
        if (ev.xclient.format == 32
            && !HOOK_INVOKE ((this, HOOK_CLIENT_MESSAGE, DT_XEVENT, &ev, DT_END))){
            if (ev.xclient.message_type == xa[XA_WM_PROTOCOLS]){
                if (!HOOK_INVOKE ((this, HOOK_WM_PROTOCOLS, DT_XEVENT, &ev, DT_END))){
                    if (ev.xclient.data.l[0] == xa[XA_WM_DELETE_WINDOW]){
                        if (!HOOK_INVOKE ((this, HOOK_WM_DELETE_WINDOW, DT_XEVENT, &ev, DT_END)))
                          destroy ();
                      }
#if ENABLE_EWMH
                    else if (ev.xclient.data.l[0] == xa[XA_NET_WM_PING])
                      XSendEvent (dpy, ev.xclient.window = display->root,
                                  False, SubstructureRedirectMask | SubstructureNotifyMask,
                                  &ev);
#endif
                  }
              }
#if ENABLE_XEMBED
            else if (ev.xclient.format == 32 && ev.xclient.message_type == xa[XA_XEMBED]){
                if (ev.xclient.data.l[1] == XEMBED_FOCUS_IN)
                  focus_in ();
                else if (ev.xclient.data.l[1] == XEMBED_FOCUS_OUT)
                  focus_out ();
              }
#endif
          }
        break;

        /*
         * XXX: this is not the _current_ arrangement 
         * Here's my conclusion: 
         * If the window is completely unobscured, use bitblt's 
         * to scroll. Even then, they're only used when doing partial 
         * screen scrolling. When partially obscured, we have to fill 
         * in the GraphicsExpose parts, which means that after each refresh, 
         * we need to wait for the graphics expose or Noexpose events, 
         * which ought to make things real slow! 
         */
      case VisibilityNotify:
        switch (ev.xvisibility.state){
            case VisibilityUnobscured:
              refresh_type = FAST_REFRESH;
              break;
            case VisibilityPartiallyObscured:
              refresh_type = SLOW_REFRESH;
              break;
            default:
              refresh_type = NO_REFRESH;
              break;
          }
        break;

      case FocusIn:
        if (ev.xfocus.detail != NotifyInferior
            && ev.xfocus.detail != NotifyPointer 
            && ev.xfocus.mode != NotifyGrab)
          focus_in ();
        break;

      case FocusOut:
        if (ev.xfocus.detail != NotifyInferior
            && ev.xfocus.detail != NotifyPointer 
            && ev.xfocus.mode != NotifyGrab)
          focus_out ();
        break;

      case ConfigureNotify:
        /*fprintf (stderr, "ConfigureNotify for %X, parent is %X, geom is %dx%d%+d%+d, old geom was %dx%d\n", 
              ev.xconfigure.window, parent[0], ev.xconfigure.width, ev.xconfigure.height, ev.xconfigure.x, ev.xconfigure.y,
              szHint.width, szHint.height);*/ 
        if (ev.xconfigure.window == parent[0]){
            while (XCheckTypedWindowEvent (dpy, ev.xconfigure.window, ConfigureNotify, &ev))
              ;

            if (szHint.width != ev.xconfigure.width || szHint.height != ev.xconfigure.height){ 
                seen_resize = 1;
                resize_all_windows (ev.xconfigure.width, ev.xconfigure.height, 1);
              }
            else{
#ifdef HAVE_BG_PIXMAP
                if (bgPixmap.window_position_sensitive ()){
                    if (mapped)
                      update_background ();
                    else
                      bgPixmap.invalidate ();
                  }
#endif
              }

            HOOK_INVOKE ((this, HOOK_CONFIGURE_NOTIFY, DT_XEVENT, &ev, DT_END));
          }
        break;

      case PropertyNotify:
        if (!HOOK_INVOKE ((this, HOOK_PROPERTY_NOTIFY, DT_XEVENT, &ev, DT_END)))
          if (ev.xproperty.atom == xa[XA_VT_SELECTION]
              && ev.xproperty.state == PropertyNewValue)
            selection_property (ev.xproperty.window, ev.xproperty.atom);

        break;

      case SelectionClear:
        selection_clear ();
        break;

      case SelectionNotify:
        if (selection_wait == Sel_normal)
          selection_paste (ev.xselection.requestor, ev.xselection.property, true);
        break;

      case SelectionRequest:
        selection_send (ev.xselectionrequest);
        break;

      case MapNotify:
#ifdef HAVE_BG_PIXMAP
        /* This is needed spcifically to fix the case of no window manager or a
         * non-reparenting window manager. In those cases we never get first 
         * ConfigureNotify. Also that speeds startup under normal WM, by taking 
         * care of multiplicity of ConfigureNotify events arriwing while WM does 
         * reparenting. 
         * We should not render background immidiately, as there could be several 
         * ConfigureNotify's to follow. Lets take care of all of them in one scoop 
         * by scheduling background redraw as soon as we can, but giving a short 
         * bit of time for ConfigureNotifies to arrive. 
         * We should render background PRIOR to drawing any text, but AFTER all 
         * of ConfigureNotifys for the best results. 
         */
        if (bgPixmap.flags & bgPixmap_t::isInvalid)
          update_background_ev.start (0.025);
#endif
        mapped = 1;
#ifdef TEXT_BLINK
        text_blink_ev.start ();
#endif
        HOOK_INVOKE ((this, HOOK_MAP_NOTIFY, DT_XEVENT, &ev, DT_END));
        break;

      case UnmapNotify:
        mapped = 0;
#ifdef TEXT_BLINK
        text_blink_ev.stop ();
#endif
        HOOK_INVOKE ((this, HOOK_UNMAP_NOTIFY, DT_XEVENT, &ev, DT_END));
        break;

      case GraphicsExpose:
      case Expose:
        if (ev.xany.window == vt){
            do
              {
                scr_expose (ev.xexpose.x, ev.xexpose.y,
                            ev.xexpose.width, ev.xexpose.height, False);
              }
            while (XCheckTypedWindowEvent (dpy, vt, ev.xany.type, &ev));

            ev.xany.type = ev.xany.type == Expose ? GraphicsExpose : Expose;

            while (XCheckTypedWindowEvent (dpy, vt, ev.xany.type, &ev)){
                scr_expose (ev.xexpose.x, ev.xexpose.y,
                            ev.xexpose.width, ev.xexpose.height, False);
              }

            want_refresh = 1;
          }
        else{
            XEvent unused_event;

            while (XCheckTypedWindowEvent (dpy, ev.xany.window, Expose, &unused_event))
              ;
            while (XCheckTypedWindowEvent (dpy, ev.xany.window, GraphicsExpose, &unused_event))
              ;

            if (scrollBar.state && ev.xany.window == scrollBar.win){
                scrollBar.state = STATE_IDLE;
                scrollBar.show (0);
              }
          }
        break;

      case MotionNotify:
#ifdef POINTER_BLANK
  if (hidden_pointer) 
      pointer_unblank (); 
#endif
        if ((priv_modes & PrivMode_MouseBtnEvent && ev.xbutton.state & (Button1Mask|Button2Mask|Button3Mask))
            || priv_modes & PrivMode_MouseAnyEvent)
          mouse_report (ev.xbutton);
        if ((priv_modes & PrivMode_mouse_report) && !bypass_keystate)
          break;

        if (ev.xany.window == vt){
            if (SHOULD_INVOKE (HOOK_MOTION_NOTIFY)
                && HOOK_INVOKE ((this, HOOK_MOTION_NOTIFY, DT_XEVENT, &ev, DT_END)))
              ; // nop
            else if (ev.xbutton.state & (Button1Mask | Button3Mask)){
                while (XCheckTypedWindowEvent (dpy, vt, MotionNotify, &ev))
                  ;

                XQueryPointer (dpy, vt, 
                               &unused_root, &unused_child,
                               &unused_root_x, &unused_root_y,
                               &ev.xbutton.x, &ev.xbutton.y,
                               &ev.xbutton.state);
#ifdef MOUSE_THRESHOLD
                /* deal with a `jumpy' mouse */
                if ((ev.xmotion.time - MEvent.time) > MOUSE_THRESHOLD){
#endif
#if ISO_14755
                    // 5.4
                    if (iso14755buf & (ISO_14755_STARTED | ISO_14755_54)){
                        iso14755_54 (ev.xbutton.x, ev.xbutton.y);
                        break;
                      }
#endif
                    selection_extend (ev.xbutton.x, ev.xbutton.y,
                                      ev.xbutton.state & Button3Mask ? 2 : 0);

#ifdef SELECTION_SCROLLING
//CMNT: c_keyword ^|                           if (ev.xbutton.y < int_bwidth 
                    if (ev.xbutton.y < _bwidth
                        || Pixel2Row (ev.xbutton.y) > (nrow-1)){
//CMNT: c_keyword ^|                               int dist; 
                         dist;

                        /* don't clobber the current delay if we are
                         * already in the middle of scrolling. 
                         */
                        if (!sel_scroll_ev.is_active ())
                          sel_scroll_ev.start (SCROLLBAR_INITIAL_DELAY, SCROLLBAR_CONTINUOUS_DELAY);

                        /* save the event params so we can highlight
                         * the selection in the pending-scroll loop 
                         */
                        selection_save_x = ev.xbutton.x;
                        selection_save_y = ev.xbutton.y;
                        selection_save_state = (ev.xbutton.state & Button3Mask) ? 2 : 0;

                        /* calc number of lines to scroll */
                        if (ev.xbutton.y < int_bwidth){ 
                            scroll_selection_dir = UP;
                            dist = int_bwidth - ev.xbutton.y; 
                          }
                        else{
                            scroll_selection_dir = DN;
                            dist = ev.xbutton.y - (int_bwidth + height); 
                          }

                        scroll_selection_lines = Pixel2Height (dist)
                                                 / SELECTION_SCROLL_LINE_SPEEDUP
                                                 + 1;
                        min_it (scroll_selection_lines,
                                SELECTION_SCROLL_MAX_LINES);
                      }
                    else{
                        /* we are within the text window, so we
                         * shouldn't be scrolling 
                         */
                        sel_scroll_ev.stop();
                      }
#endif
#ifdef MOUSE_THRESHOLD
                  }
#endif
              }
          }
        else if (scrollBar.state == STATE_MOTION && ev.xany.window == scrollBar.win){
            while (XCheckTypedWindowEvent (dpy, scrollBar.win,
                                           MotionNotify, &ev))
              ;

            XQueryPointer (dpy, scrollBar.win, 
                          &unused_root, &unused_child,
                          &unused_root_x, &unused_root_y,
                          &ev.xbutton.x, &ev.xbutton.y,
                          &unused_mask);
            scr_move_to (scrollbar_position (ev.xbutton.y) - csrO,
                         scrollBar.size ());
            want_refresh = 1;
            scrollBar.show (1);
          }
        break;
    }

#if defined(CURSOR_BLINK)
  if (option (Opt_cursorBlink) && ev.type == KeyPress){
      if (hidden_cursor){
          hidden_cursor = 0;
          want_refresh = 1;
        }

      cursor_blink_ev.again ();
    }
#endif

#if defined(POINTER_BLANK)
    if (option (Opt_pointerBlank) && pointerBlankDelay > 0){ 
      if (ev.type == MotionNotify
          || ev.type == ButtonPress
          || ev.type == ButtonRelease)
          if (hidden_pointer) 
              pointer_unblank (); 

      if (ev.type == KeyPress && hidden_pointer == 0) 
               pointer_blank (); 
    }
#endif

  refresh_check ();
}

#if ENABLE_FRILLS
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::set_urgency (bool enable){ 
rxvt_term.set_urgency =function(bool enable){ 
         if (enable == urgency_hint) 
    return;

//CMNT: c_keyword possible_pointer ^|         if (XWMHints *h = XGetWMHints (dpy, parent[0])){ 
  if (XWMHs  h  = XGetWMHs (dpy, parent[0])){
//CMNT: c_keyword ^|             h->flags = h->flags & ~XUrgencyHint | (enable ? XUrgencyHint : 0); 
      h->flags = h->flags & ~XUrgencyH | (enable ? XUrgencyH : 0);
//CMNT: c_keyword ^|             XSetWMHints (dpy, parent[0], h); 
      XSetWMHs (dpy, parent[0], h);
//CMNT: c_keyword ^|             urgency_hint = enable; 
      urgency_h = enable;
    }
}
#endif

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::focus_in (){ 
rxvt_term.focus_in =function(){ 
  if (!focus){
      focus = 1;
      want_refresh = 1;

#if USE_XIM
      if (Input_Context != NULL){
          IMSetPosition ();
          XSetICFocus (Input_Context);
        }
#endif
#if CURSOR_BLINK
      if (option (Opt_cursorBlink))
        cursor_blink_ev.again ();
#endif
#if OFF_FOCUS_FADING
      if (rs[Rs_fade]){
          pix_colors = pix_colors_focused;
          scr_recolour ();
        }
#endif
#if ENABLE_FRILLS
      if (option (Opt_urgentOnBell))
        set_urgency (0);
#endif

      HOOK_INVOKE ((this, HOOK_FOCUS_IN, DT_END));
    }
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::focus_out (){ 
rxvt_term.focus_out =function(){ 
  if (focus){
      focus = 0;
      want_refresh = 1;

#if ENABLE_FRILLS
      if (option (Opt_urgentOnBell))
        set_urgency (0);
#endif
#if ENABLE_FRILLS || ISO_14755
      if (iso14755buf){
          iso14755buf = 0;
# if ISO_14755
          scr_overlay_off ();
# endif
        }
#endif
#if USE_XIM
      if (Input_Context != NULL)
        XUnsetICFocus (Input_Context);
#endif
#if CURSOR_BLINK
      if (option (Opt_cursorBlink))
        cursor_blink_ev.stop ();

      hidden_cursor = 0;
#endif
#if OFF_FOCUS_FADING
      if (rs[Rs_fade]){
          pix_colors = pix_colors_unfocused;
          scr_recolour ();
        }
#endif

      HOOK_INVOKE ((this, HOOK_FOCUS_OUT, DT_END));
    }
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::update_fade_color (unsigned int idx){ 
rxvt_term.update_fade_color =function(  idx){ 
#if OFF_FOCUS_FADING
  if (rs[Rs_fade]){
      rgba c;
      pix_colors [Color_fade].get (c);
      pix_colors_focused [idx].fade (this, atoi (rs[Rs_fade]), pix_colors_unfocused [idx], c);
    }
#endif
}

#if ENABLE_TRANSPARENCY || ENABLE_PERL
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::rootwin_cb (XEvent &ev){ 
rxvt_term.rootwin_cb =function(XEvent &ev){ 
  make_current ();

  if (SHOULD_INVOKE (HOOK_ROOT_EVENT)
      && HOOK_INVOKE ((this, HOOK_ROOT_EVENT, DT_XEVENT, &ev, DT_END)))
    return;

# if ENABLE_TRANSPARENCY
  switch (ev.type){
      case PropertyNotify:
        /*
         * if user used some Esetroot compatible prog to set the root bg, 
         * use the property to determine the pixmap.  We use it later on. 
         */
        if (ev.xproperty.atom == xa[XA_XROOTPMAP_ID]
            || ev.xproperty.atom == xa[XA_ESETROOT_PMAP_ID]){
            bgPixmap.set_root_pixmap ();
            update_background ();
          }

        break;
    }
# endif

  refresh_check ();
}
#endif

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::button_press (XButtonEvent &ev){ 
rxvt_term.button_press =function(XButtonEvent &ev){ 
//CMNT: c_keyword js_style_variables ^|         int reportmode = 0, clickintime; 
 var reportmode= 0, clickime; 

  bypass_keystate = ev.state & (ModMetaMask | ShiftMask);

  if (!bypass_keystate)
    reportmode = !! (priv_modes & PrivMode_mouse_report);

  /*
   * VT window processing of button press 
   */
  if (ev.window == vt){
      if (HOOK_INVOKE ((this, HOOK_BUTTON_PRESS, DT_XEVENT, &ev, DT_END)))
        return;

#if ISO_14755
      // 5.4
      if (iso14755buf & (ISO_14755_STARTED | ISO_14755_54)){
          iso14755_54 (ev.x, ev.y);
          return;
        }
#endif

//CMNT: c_keyword ^|             clickintime = ev.time - MEvent.time < MULTICLICK_TIME; 
      clickime = ev.time - MEvent.time < MULTICLICK_TIME;

      if (reportmode){
          /* mouse report from vt window */
          /* save the xbutton state (for ButtonRelease) */
          MEvent.state = ev.state;
#ifdef MOUSE_REPORT_DOUBLECLICK
//CMNT: c_keyword ^|                 if (ev.button == MEvent.button && clickintime){ 
          if (ev.button == MEvent.button && clickime){
              /* same button, within alloted time */
              MEvent.clicks++;

              if (MEvent.clicks > 1){
                  /* only report double clicks */
                  MEvent.clicks = 2;
                  mouse_report (ev);

                  /* don't report the release */
                  MEvent.clicks = 0;
                  MEvent.button = AnyButton;
                }
            }
          else{
              /* different button, or time expired */
              MEvent.clicks = 1;
              MEvent.button = ev.button;
              mouse_report (ev);
            }
#else
          MEvent.button = ev.button;
          mouse_report (ev);
#endif /* MOUSE_REPORT_DOUBLECLICK */

        }
      else{
          if (ev.button != MEvent.button)
            MEvent.clicks = 0;

          switch (ev.button){
              case Button1:
                /* allow meta + click to select rectangular areas */
                /* should be done in screen.C */
#if ENABLE_FRILLS
                selection.rect = !!(ev.state & ModMetaMask);
#else
                selection.rect = false;
#endif

                /* allow shift+left click to extend selection */
                if (ev.state & ShiftMask && !(priv_modes & PrivMode_mouse_report)){
//CMNT: c_keyword ^|                           if (MEvent.button == Button1 && clickintime) 
                    if (MEvent.button == Button1 && clickime)
                      selection_rotate (ev.x, ev.y);
                    else
                      selection_extend (ev.x, ev.y, 1);
                  }
                else{
//CMNT: c_keyword ^|                           if (MEvent.button == Button1 && clickintime) 
                    if (MEvent.button == Button1 && clickime)
                      MEvent.clicks++;
                    else
                      MEvent.clicks = 1;

                    selection_click (MEvent.clicks, ev.x, ev.y);
                  }

                MEvent.button = Button1;
                break;

              case Button3:
//CMNT: c_keyword ^|                       if (MEvent.button == Button3 && clickintime) 
                if (MEvent.button == Button3 && clickime)
                  selection_rotate (ev.x, ev.y);
                else
                  selection_extend (ev.x, ev.y, 1);

                MEvent.button = Button3;
                break;
            }
        }

      MEvent.time = ev.time;
      return;
    }

  /*
   * Scrollbar window processing of button press 
   */
  if (scrollBar.state && ev.window == scrollBar.win){
      page_dirn direction = NO_DIR;

      if (scrollBar.upButton (ev.y))
        direction = UP; /* up */
      else if (scrollBar.dnButton (ev.y))
        direction = DN;  /* down */

      scrollBar.state = STATE_IDLE;
      /*
       * Rxvt-style scrollbar: 
       * move up if mouse is above slider 
       * move dn if mouse is below slider 
       *
       * XTerm-style scrollbar: 
       * Move display proportional to pointer location 
       * pointer near top -> scroll one line 
       * pointer near bot -> scroll full page 
       */
#ifndef NO_SCROLLBAR_REPORT
      if (reportmode){
          /*
           * Mouse report disabled scrollbar: 
           * arrow buttons - send up/down 
           * click on scrollbar - send pageup/down 
           */
          if (direction == UP)
//CMNT: c_keyword ^|                   tt_printf ("\033[A"); 
            tt_prf ("\033[A");
          else if (direction == DN)
//CMNT: c_keyword ^|                   tt_printf ("\033[B"); 
            tt_prf ("\033[B");
          else
            switch (ev.button){
                case Button2:
//CMNT: c_keyword ^|                         tt_printf ("\014"); 
                  tt_prf ("\014");
                  break;
                case Button1:
//CMNT: c_keyword ^|                         tt_printf ("\033[6~"); 
                  tt_prf ("\033[6~");
                  break;
                case Button3:
//CMNT: c_keyword ^|                         tt_printf ("\033[5~"); 
                  tt_prf ("\033[5~");
                  break;
              }
        }
      else
#endif /* NO_SCROLLBAR_REPORT */
        {
          if (direction != NO_DIR){
#ifndef NO_SCROLLBAR_BUTTON_CONTINUAL_SCROLLING
              if (!cont_scroll_ev.is_active ())
                cont_scroll_ev.start (SCROLLBAR_INITIAL_DELAY, SCROLLBAR_CONTINUOUS_DELAY);
#endif
              if (scr_page (direction, 1)){
                  if (direction == UP)
                    scrollBar.state = STATE_UP;
                  else
                    scrollBar.state = STATE_DOWN;
                }
            }
          else
            switch (ev.button){
                case Button2:
                  switch (scrollBar.align){
                      case R_SB_ALIGN_TOP:
                        csrO = 0;
                        break;
                      case R_SB_ALIGN_CENTRE:
                        csrO = (scrollBar.bot - scrollBar.top) / 2;
                        break;
                      case R_SB_ALIGN_BOTTOM:
                        csrO = scrollBar.bot - scrollBar.top;
                        break;
                    }

                  if (scrollBar.style == R_SB_XTERM
                      || scrollbar_above_slider (ev.y)
                      || scrollbar_below_slider (ev.y))
                    scr_move_to (scrollbar_position (ev.y) - csrO, scrollBar.size ());

                  scrollBar.state = STATE_MOTION;
                  break;

                case Button1:
                  if (scrollBar.align == R_SB_ALIGN_CENTRE)
                    csrO = ev.y - scrollBar.top;
                  /* FALLTHROUGH */

                case Button3:
                  if (scrollBar.style != R_SB_XTERM){
                      if (scrollbar_above_slider (ev.y))
# ifdef RXVT_SCROLL_FULL
                        scr_page (UP, nrow - 1);
# else
                        scr_page (UP, nrow / 4);
# endif
                      else if (scrollbar_below_slider (ev.y))
# ifdef RXVT_SCROLL_FULL
                        scr_page (DN, nrow - 1);
# else
                        scr_page (DN, nrow / 4);
# endif
                      else
                        scrollBar.state = STATE_MOTION;
                    }
                  else{
                      scr_page ((ev.button == Button1 ? DN : UP),
                                (nrow
//CMNT: possible_pointer ^|                                        * scrollbar_position (ev.y) 
                                    scrollbar_position (ev.y)
                                 / scrollBar.size ()));
                    }

                  break;
              }
        }

      return;
    }
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::button_release (XButtonEvent &ev){ 
rxvt_term.button_release =function(XButtonEvent &ev){ 
//CMNT: js_style_variables ^|         int reportmode = 0; 
 var reportmode= 0; 

  csrO = 0;		/* reset csr Offset */
  if (!bypass_keystate)
    reportmode = !! (priv_modes & PrivMode_mouse_report);

  if (scrollBar.state == STATE_UP || scrollBar.state == STATE_DOWN){
      scrollBar.state = STATE_IDLE;
      scrollBar.show (0);
    }

#ifdef SELECTION_SCROLLING
  sel_scroll_ev.stop();
#endif

  if (ev.window == vt){
      if (HOOK_INVOKE ((this, HOOK_BUTTON_RELEASE, DT_XEVENT, &ev, DT_END)))
        return;

#if ISO_14755
      // 5.4
      if (iso14755buf & (ISO_14755_STARTED | ISO_14755_54))
        return;
#endif

      if (reportmode){
          /* mouse report from vt window */
          /* don't report release of wheel "buttons" */
          if (ev.button >= 4)
            return;
#ifdef MOUSE_REPORT_DOUBLECLICK
          /* only report the release of 'slow' single clicks */
          if (MEvent.button != AnyButton
              && (ev.button != MEvent.button
                  || (ev.time - MEvent.time
                      > MULTICLICK_TIME / 2))){
              MEvent.clicks = 0;
              MEvent.button = AnyButton;
              mouse_report (ev);
            }
#else				/* MOUSE_REPORT_DOUBLECLICK */
          MEvent.button = AnyButton;
          mouse_report (ev);
#endif /* MOUSE_REPORT_DOUBLECLICK */
          return;
        }

      /*
       * dumb hack to compensate for the failure of click-and-drag 
       * when overriding mouse reporting 
       */
      if (priv_modes & PrivMode_mouse_report
          && bypass_keystate
          && ev.button == Button1 && MEvent.clicks <= 1)
        selection_extend (ev.x, ev.y, 0);

      switch (ev.button){
          case Button1:
          case Button3:
            selection_make (ev.time);
            break;

          case Button2:
            if (IN_RANGE_EXC (ev.x, 0, width) && IN_RANGE_EXC (ev.y, 0, height)) // inside window?
	      selection_request (ev.time, ev.state & ModMetaMask ? Sel_Clipboard : Sel_Primary);
            break;

#ifdef MOUSE_WHEEL
          case Button4:
          case Button5:
            {
//CMNT: c_keyword ^|                     int i; 
               i;
              page_dirn v;

              v = ev.button == Button4 ? UP : DN;

              if (ev.state & ShiftMask)
                i = 1;
              else if (option (Opt_mouseWheelScrollPage))
                i = nrow - 1;
              else
                i = 5;

# ifdef MOUSE_SLIP_WHEELING
              if (ev.state & ControlMask){
                  mouse_slip_wheel_speed += v ? -1 : 1;
                  if (mouse_slip_wheel_speed < -nrow) mouse_slip_wheel_speed = -nrow;
                  if (mouse_slip_wheel_speed > +nrow) mouse_slip_wheel_speed = +nrow;

                  if (!slip_wheel_ev.is_active ())
                    slip_wheel_ev.start (SCROLLBAR_CONTINUOUS_DELAY, SCROLLBAR_CONTINUOUS_DELAY);
                }
              else
# endif
                {
                  scr_page (v, i);
                  scrollBar.show (1);
                }
            }
            break;
#endif
        }
    }
}

/*}}} */

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::cmd_parse (){ 
rxvt_term.cmd_parse =function(){ 
//CMNT: js_style_variables ^|         wchar_t ch = NOCHAR; 
 var ch= NOCHAR; 
 char *seq_begin; // remember start of esc-sequence here 

  for (;;){
      if (expect_false (ch == NOCHAR)){
          seq_begin = cmdbuf_ptr;
//CMNT: c_keyword ^|                 ch = next_char (); 
          ch = next_ ();

          if (ch == NOCHAR)
            break;
        }

      if (expect_true (!IS_CONTROL (ch) || ch == C0_LF || ch == C0_CR || ch == C0_HT)){
          if (expect_false (!seen_input)){
              seen_input = 1;
              // many badly-written programs (e.g. jed) contain a race condition:
              // they first read the screensize and then install a SIGWINCH handler.
              // some window managers resize the window early, and these programs
              // then sometimes get the size wrong.
              // unfortunately other programs are even more buggy and dislike
              // being sent SIGWINCH, so only do it when we were in fact being
              // resized.
              if (seen_resize && cmd_pid)
                kill (-cmd_pid, SIGWINCH);
            }

          /* Read a text string from the input buffer */
//CMNT: c_keyword ^|                 wchar_t buf[UBUFSIZ]; 
           buf[UBUFSIZ];
          bool refreshnow = false;
//CMNT: js_style_variables ^|                 int nlines = 0; 
 var nlines= 0; 
//CMNT: c_keyword possible_pointer ^|                 wchar_t *str = buf; 
            s tr = buf;
//CMNT: c_keyword possible_pointer ^|                 wchar_t *eol = str + min (ncol, UBUFSIZ); 
            e ol = str + min (ncol, UBUFSIZ);

          for (;;){
              if (expect_false (ch == NOCHAR || (IS_CONTROL (ch) && ch != C0_LF && ch != C0_CR && ch != C0_HT)))
                break;

//CMNT: possible_pointer ^|                     *str++ = ch; 
               s tr++ = ch;

              if (expect_false (ch == C0_LF || str >= eol)){
                  if (ch == C0_LF)
                    nlines++;

                  refresh_count++;

                  if (!option (Opt_jumpScroll) || refresh_count >= nrow - 1){
                      refresh_count = 0;

//CMNT: js_style_functions ^|                             if (!option (Opt_skipScroll) || ev_time () > ev::now () + 1. / 60.){ 
                      if (!option (Opt_skipScroll) || ev_time () >ev.now =function() + 1. / 60.){ 
                          refreshnow = true;
                          ch = NOCHAR;
                          break;
                        }
                    }

                  // scr_add_lines only works for nlines <= nrow - 1.
                  if (nlines >= nrow - 1){
                      if (!(SHOULD_INVOKE (HOOK_ADD_LINES)
                            && HOOK_INVOKE ((this, HOOK_ADD_LINES, DT_WCS_LEN, buf, str - buf, DT_END))))
                        scr_add_lines (buf, str - buf, nlines);

                      nlines = 0;
                      str = buf;
                      eol = str + min (ncol, UBUFSIZ);
                    }

                  if (str >= eol){
                      if (eol >= buf + UBUFSIZ){
                          ch = NOCHAR;
                          break;
                        }
                      else
                        eol = min (eol + ncol, buf + UBUFSIZ);
                    }

                }

              seq_begin = cmdbuf_ptr;
//CMNT: c_keyword ^|                     ch = next_char (); 
              ch = next_ ();
            }

          if (!(SHOULD_INVOKE (HOOK_ADD_LINES)
                && HOOK_INVOKE ((this, HOOK_ADD_LINES, DT_WCS_LEN, buf, str - buf, DT_END))))
            scr_add_lines (buf, str - buf, nlines);

          /*
           * If there have been a lot of new lines, then update the screen 
           * What the heck we'll cheat and only refresh less than every page-full. 
           * if skipScroll is enabled. 
           */
          if (refreshnow){
              scr_refresh ();
              want_refresh = 1;
            }
        }
      else{
          try
            {
//CMNT: c_keyword ^|                     process_nonprinting (ch); 
              process_nonpring (ch);
            }
//CMNT: c_keyword ^|                 catch (const class out_of_input &o){ 
          catch ( class out_of_input &o){
              // we ran out of input, retry later
              cmdbuf_ptr = seq_begin;
              break;
            }

          ch = NOCHAR;
        }
    }
}

// read the next character 
//CMNT: js_style_functions c_keyword ^|       wchar_t rxvt_term::next_char (){ 
rxvt_term.next_ =function(){ 
  while (cmdbuf_ptr < cmdbuf_endp){
      // assume 7-bit to be ascii ALWAYS
//CMNT: c_keyword possible_pointer ^|             if (expect_true ((unsigned char)*cmdbuf_ptr <= 0x7f && *cmdbuf_ptr != 0x1b)) 
      if (expect_true (( ) c mdbuf_ptr <= 0x7f &&  c mdbuf_ptr != 0x1b))
//CMNT: possible_pointer ^|               return *cmdbuf_ptr++; 
        return  c mdbuf_ptr++;

//CMNT: c_keyword ^|             wchar_t wc; 
       wc;
      size_t len = mbrtowc (&wc, cmdbuf_ptr, cmdbuf_endp - cmdbuf_ptr, mbstate);

      if (len == (size_t)-2){
          // the mbstate stores incomplete sequences. didn't know this :/
          cmdbuf_ptr = cmdbuf_endp;
          break;
        }

      if (len == (size_t)-1){
          mbrtowc (0, 0, 0, mbstate); // reset now undefined conversion state
//CMNT: c_keyword possible_pointer ^|                 return (unsigned char)*cmdbuf_ptr++; // the _occasional_ latin1 character is allowed to slip through 
          return ( ) c mdbuf_ptr++; // the _occasional_ latin1 acter is allowed to slip through
        }

//CMNT: c_keyword ^|             // assume wchar == unicode 
      // assume w == unicode
      cmdbuf_ptr += len;
      return wc & UNICODE_MASK;
    }

  return NOCHAR;
}

// read the next octet
//CMNT: c_keyword ^|       uint32_t 
u32_t
//CMNT: js_style_functions ^|       rxvt_term::next_octet () NOTHROW 
rxvt_term.next_octet =function() NOTHROW 
{
  return cmdbuf_ptr < cmdbuf_endp
//CMNT: c_keyword possible_pointer ^|                ? (unsigned char)*cmdbuf_ptr++ 
         ? ( ) c mdbuf_ptr++
         : NOCHAR;
}

//CMNT: c_keyword ^|       static class out_of_input out_of_input; 
 class out_of_input out_of_input;

/* rxvt_cmd_getc () - Return next input character */ 
/*
 * Return the next input character after first passing any keyboard input 
 * to the command. 
 */
//CMNT: js_style_functions c_keyword ^|       wchar_t rxvt_term::cmd_getc () THROW ((class out_of_input)){ 
rxvt_term.cmd_getc =function() THROW ((class out_of_input)){ 
//CMNT: c_keyword js_style_variables ^|         wchar_t c = next_char (); 
 var c= next_ (); 

  if (c == NOCHAR)
    throw out_of_input;

  return c;
}

//CMNT: c_keyword ^|       uint32_t 
u32_t
rxvt_term::cmd_get8 () THROW ((class out_of_input)){
//CMNT: c_keyword ^|         uint32_t c = next_octet (); 
  u32_t c = next_octet ();

  if (c == NOCHAR)
    throw out_of_input;

  return c;
}

//CMNT: c_keyword ^|       /*{{{ print pipe */ 
/*{{{ pr pipe */
/*----------------------------------------------------------------------*/
#ifdef PRINTPIPE
FILE *
//CMNT: js_style_functions c_keyword ^|       rxvt_term::popen_printer (){ 
rxvt_term.popen_prer =function(){ 
//CMNT: c_keyword possible_pointer ^|         FILE *stream = popen (rs[Rs_print_pipe] ? rs[Rs_print_pipe] : PRINTPIPE, "w"); 
  FILE  s tream = popen (rs[Rs_pr_pipe] ? rs[Rs_pr_pipe] : PRINTPIPE, "w");

  if (stream == NULL)
//CMNT: c_keyword ^|           rxvt_warn ("can't open printer pipe, not printing.\n"); 
    rxvt_warn ("can't open prer pipe, not pring.\n");

  return stream;
}

//CMNT: js_style_functions c_keyword possible_pointer ^|       int rxvt_term::pclose_printer (FILE *stream){ 
rxvt_term.pclose_prer =function(FILE  s tream){ 
  fflush (stream);
  return pclose (stream);
}

/*
 * simulate attached vt100 printer 
 */
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::process_print_pipe (){ 
rxvt_term.process_pr_pipe =function(){ 
//CMNT: c_keyword possible_pointer ^|         FILE *fd = popen_printer (); 
  FILE  f d = popen_prer ();

  if (!fd)
    return;

  /*
   * Send all input to the printer until either ESC[4i or ESC[?4i 
   * is received. 
   */
//CMNT: c_keyword ^|         for (int done = 0; !done; ){ 
  for ( done = 0; !done; ){
//CMNT: c_keyword ^|             unsigned char buf[8]; 
        buf[8];
//CMNT: c_keyword ^|             unicode_t ch; 
      ch;
//CMNT: c_keyword ^|             unsigned int i, len; 
        i, len;

      if ((ch = cmd_getc ()) != C0_ESC){
          if (putc (ch, fd) == EOF)
            break;		/* done = 1 */
        }
      else{
          len = 0;
          buf[len++] = ch;

          if ((buf[len++] = cmd_getc ()) == '['){
              if ((ch = cmd_getc ()) == '?'){
                  buf[len++] = '?';
                  ch = cmd_getc ();
                }
              if ((buf[len++] = ch) == '4'){
                  if ((buf[len++] = cmd_getc ()) == 'i')
                    break;	/* done = 1 */
                }
            }

          for (i = 0; i < len; i++)
            if (putc (buf[i], fd) == EOF){
                done = 1;
                break;
              }
        }
    }

  pclose_printer (fd); 
}
#endif /* PRINTPIPE */
/*}}} */

/* *INDENT-OFF* */ 
enum {
  C1_40 = 0x40,
          C1_41 , C1_BPH, C1_NBH, C1_44 , C1_NEL, C1_SSA, C1_ESA,
  C1_HTS, C1_HTJ, C1_VTS, C1_PLD, C1_PLU, C1_RI , C1_SS2, C1_SS3,
  C1_DCS, C1_PU1, C1_PU2, C1_STS, C1_CCH, C1_MW , C1_SPA, C1_EPA,
  C1_SOS, C1_59 , C1_SCI, C1_CSI, CS_ST , C1_OSC, C1_PM , C1_APC,
};
/* *INDENT-ON* */ 

/*{{{ process non-printing single characters */ 
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::process_nonprinting (unicode_t ch){ 
rxvt_term.process_nonpring =function(ch){ 
  switch (ch){
      case C0_ESC:
        process_escape_seq ();
        break;
      case C0_ENQ:	/* terminal Status */
        if (rs[Rs_answerbackstring])
          tt_write (rs [Rs_answerbackstring], strlen (rs [Rs_answerbackstring]));
        else
          tt_write (VT100_ANS, strlen (VT100_ANS));
        break;
      case C0_BEL:	/* bell */
        scr_bell ();
        break;
      case C0_BS:		/* backspace */
        scr_backspace ();
        break;
      case C0_HT:		/* tab */
        scr_tab (1);
        break;
      case C0_CR:		/* carriage return */
        scr_gotorc (0, 0, R_RELATIVE);
        break;
      case C0_VT:		/* vertical tab, form feed */
      case C0_FF:
      case C0_LF:		/* line feed */
        scr_index (UP);
        break;
      case C0_SO:		/* shift out - acs */
//CMNT: c_keyword ^|               scr_charset_choose (1); 
        scr_set_choose (1);
        break;
      case C0_SI:		/* shift in - acs */
//CMNT: c_keyword ^|               scr_charset_choose (0); 
        scr_set_choose (0);
        break;

#ifdef EIGHT_BIT_CONTROLS
      // 8-bit controls
      case 0x90: 	/* DCS */
        process_dcs_seq ();
        break;
      case 0x9b: 	/* CSI */
        process_csi_seq ();
        break;
      case 0x9d: 	/* OSC */
        process_osc_seq ();
        break;
#endif
    }
}
/*}}} */


/*{{{ process VT52 escape sequences */
//CMNT: c_keyword ^|       void 

//CMNT: c_keyword ^|       rxvt_term::process_escape_vt52 (unicode_t ch){ 
rxvt_term::process_escape_vt52 (ch){
//CMNT: c_keyword ^|         int row, col; 
   row, col;

  switch (ch){
      case 'A':		/* cursor up */
        scr_gotorc (-1, 0, R_RELATIVE | C_RELATIVE);
        break;
      case 'B':		/* cursor down */
        scr_gotorc (1, 0, R_RELATIVE | C_RELATIVE);
        break;
      case 'C':		/* cursor right */
        scr_gotorc (0, 1, R_RELATIVE | C_RELATIVE);
        break;
      case 'D':		/* cursor left */
        scr_gotorc (0, -1, R_RELATIVE | C_RELATIVE);
        break;
      case 'H':		/* cursor home */
        scr_gotorc (0, 0, 0);
        break;
      case 'I':		/* cursor up and scroll down if needed */
        scr_index (DN);
        break;
      case 'J':		/* erase to end of screen */
        scr_erase_screen (0);
        break;
      case 'K':		/* erase to end of line */
        scr_erase_line (0);
        break;
      case 'Y':         	/* move to specified row and col */
        /* full command is 'ESC Y row col' where row and col
         * are encoded by adding 32 and sending the ascii 
         * character.  eg. SPACE = 0, '+' = 13, '0' = 18, 
         * etc. */ 
        row = cmd_getc () - ' ';
        col = cmd_getc () - ' ';
        scr_gotorc (row, col, 0);
        break;
      case 'Z':		/* identify the terminal type */
//CMNT: c_keyword ^|               tt_printf ("\033/Z");	/* I am a VT100 emulating a VT52 */ 
        tt_prf ("\033/Z");	/* I am a VT100 emulating a VT52 */
        break;
      case '<':		/* turn off VT52 mode */
        set_privmode (PrivMode_vt52, 0);
        break;
//CMNT: c_keyword ^|             case 'F':     	/* use special graphics character set */ 
      case 'F':     	/* use special graphics acter set */
//CMNT: c_keyword ^|             case 'G':           /* use regular character set */ 
      case 'G':           /* use regular acter set */
        /* unimplemented */
        break;
      case '=':     	/* use alternate keypad mode */
      case '>':           /* use regular keypad mode */
        /* unimplemented */
        break;
    }
}
/*}}} */


/*{{{ process escape sequences */
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::process_escape_seq (){ 
rxvt_term.process_escape_seq =function(){ 
//CMNT: js_style_variables ^|         unicode_t ch = cmd_getc (); 
 var ch= cmd_getc (); 

  if (priv_modes & PrivMode_vt52){
      process_escape_vt52 (ch);
      return;
    }

  switch (ch){
        /* case 1:        do_tek_mode (); break; */
      case '#':
        if (cmd_getc () == '8')
          scr_E ();
        break;
      case '(':
//CMNT: c_keyword ^|               scr_charset_set (0, (unsigned int)cmd_getc ()); 
        scr_set_set (0, ( )cmd_getc ());
        break;
      case ')':
//CMNT: c_keyword ^|               scr_charset_set (1, (unsigned int)cmd_getc ()); 
        scr_set_set (1, ( )cmd_getc ());
        break;
  case '*': 
//CMNT: c_keyword ^|               scr_charset_set (2, (unsigned int)cmd_getc ()); 
        scr_set_set (2, ( )cmd_getc ());
        break;
      case '+':
//CMNT: c_keyword ^|               scr_charset_set (3, (unsigned int)cmd_getc ()); 
        scr_set_set (3, ( )cmd_getc ());
        break;
#if !ENABLE_MINIMAL
      case '6':
        scr_backindex ();
        break;
#endif
      case '7':
        scr_cursor (SAVE);
        break;
      case '8':
        scr_cursor (RESTORE);
        break;
#if !ENABLE_MINIMAL
      case '9':
        scr_forwardindex ();
        break;
#endif
      case '=':
      case '>':
        set_privmode (PrivMode_aplKP, ch == '=');
        break;

      case C1_40:
        cmd_getc ();
        break;
      case C1_44:
        scr_index (UP);
        break;

        /* 8.3.87: NEXT LINE */
      case C1_NEL:		/* ESC E */
        {
//CMNT: js_style_variables js_style_arrays ^|                 wchar_t nlcr[] = { C0_LF, C0_CR }; 
 var nlcr= [ C0_LF, C0_CR ] ; 
          scr_add_lines (nlcr, sizeof (nlcr) / sizeof (nlcr [0]), 1);
        }
        break;

        /* kidnapped escape sequence: Should be 8.3.48 */
      case C1_ESA:		/* ESC G */
        process_graphics ();
        break;

        /* 8.3.63: CHARACTER TABULATION SET */
      case C1_HTS:		/* ESC H */
        scr_set_tab (1);
        break;

        /* 8.3.105: REVERSE LINE FEED */
      case C1_RI:			/* ESC M */
        scr_index (DN);
        break;

        /* 8.3.142: SINGLE-SHIFT TWO */
      /*case C1_SS2: scr_single_shift (2);   break; */

        /* 8.3.143: SINGLE-SHIFT THREE */
      /*case C1_SS3: scr_single_shift (3);   break; */

        /* 8.3.27: DEVICE CONTROL STRING */
      case C1_DCS:		/* ESC P */
        process_dcs_seq ();
        break;

        /* 8.3.110: SINGLE CHARACTER INTRODUCER */
      case C1_SCI:		/* ESC Z */
        tt_write (ESCZ_ANSWER, sizeof (ESCZ_ANSWER) - 1);
        break;			/* steal obsolete ESC [ c */

        /* 8.3.16: CONTROL SEQUENCE INTRODUCER (CSI) */
      case C1_CSI:		/* ESC [ */
        process_csi_seq ();
        break;

        /* 8.3.90: OPERATING SYSTEM COMMAND (OSC) */
      case C1_OSC:		/* ESC ] */
        process_osc_seq ();
        break;

        /* 8.3.106: RESET TO INITIAL STATE (RIS) */
      case 'c':
        mbstate.reset ();
        scr_poweron ();
        scrollBar.show (1);
        break;

        /* 8.3.79: LOCKING-SHIFT TWO (see ISO2022) */
      case 'n':
//CMNT: c_keyword ^|               scr_charset_choose (2); 
        scr_set_choose (2);
        break;

        /* 8.3.81: LOCKING-SHIFT THREE (see ISO2022) */
      case 'o':
//CMNT: c_keyword ^|               scr_charset_choose (3); 
        scr_set_choose (3);
        break;
    }
}
/*}}} */

/*{{{ process CONTROL SEQUENCE INTRODUCER (CSI) sequences `ESC[' */
/* *INDENT-OFF* */ 
enum {
  CSI_ICH = 0x40,
           CSI_CUU, CSI_CUD, CSI_CUF, CSI_CUB, CSI_CNL, CSI_CPL, CSI_CHA,
  CSI_CUP, CSI_CHT, CSI_ED , CSI_EL , CSI_IL , CSI_DL , CSI_EF , CSI_EA ,
  CSI_DCH, CSI_SEE, CSI_CPR, CSI_SU , CSI_SD , CSI_NP , CSI_PP , CSI_CTC,
  CSI_ECH, CSI_CVT, CSI_CBT, CSI_SRS, CSI_PTX, CSI_SDS, CSI_SIMD, CSI_5F,
  CSI_HPA, CSI_HPR, CSI_REP, CSI_DA , CSI_VPA, CSI_VPR, CSI_HVP, CSI_TBC,
  CSI_SM , CSI_MC , CSI_HPB, CSI_VPB, CSI_RM , CSI_SGR, CSI_DSR, CSI_DAQ,
  CSI_70 , CSI_71 , CSI_72 , CSI_73 , CSI_74 , CSI_75 , CSI_76 , CSI_77 ,
  CSI_78 , CSI_79 , CSI_7A , CSI_7B , CSI_7C , CSI_7D , CSI_7E , CSI_7F
};

#define make_byte(b7,b6,b5,b4,b3,b2,b1,b0)			\
    (((b7) << 7) | ((b6) << 6) | ((b5) << 5) | ((b4) << 4)	\
     | ((b3) << 3) | ((b2) << 2) | ((b1) << 1) | (b0))
#define get_byte_array_bit(array, bit)				\
    (!! ((array)[ (bit) / 8] & (128 >> ((bit) & 7))))

//CMNT: c_keyword ^|       const unsigned char csi_defaults[] = 
   csi_defaults[] =
  {
    make_byte (1,1,1,1,1,1,1,1),	/* @, A, B, C, D, E, F, G, */
    make_byte (1,1,0,0,1,1,0,0),	/* H, I, J, K, L, M, N, O, */
    make_byte (1,0,1,1,1,1,1,0),	/* P, Q, R, S, T, U, V, W, */
    make_byte (1,1,1,0,0,0,1,0),	/* X, Y, Z, [, \, ], ^, _, */
    make_byte (1,1,1,0,1,1,1,0),	/* `, a, b, c, d, e, f, g, */
    make_byte (0,0,1,1,0,0,0,0),	/* h, i, j, k, l, m, n, o, */
    make_byte (0,0,0,0,0,0,0,0),	/* p, q, r, s, t, u, v, w, */
    make_byte (0,0,0,0,0,0,0,0),	/* x, y, z, {, |, }, ~,    */
  };
/* *INDENT-ON* */ 

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::process_csi_seq (){ 
rxvt_term.process_csi_seq =function(){ 
//CMNT: c_keyword ^|         unicode_t ch, priv, i; 
  ch, priv, i;
//CMNT: c_keyword ^|         unsigned int nargs, p; 
    nargs, p;
//CMNT: c_keyword ^|         int n, ndef; 
   n, ndef;
//CMNT: c_keyword ^|         int arg[ESC_ARGS] = { }; 
   arg[ESC_ARGS] = { };

  nargs = 0;

  priv = 0;
  ch = cmd_getc ();
  if ((ch >= '<' && ch <= '?') || ch == '!'){
      /* '<' '=' '>' '?' '!' */
      priv = ch;
      ch = cmd_getc ();
    }

  /* read any numerical arguments */
  for (n = -1; ch < CSI_ICH; ){
      if (isdigit (ch)){
          if (n < 0)
            n = ch - '0';
          else
              n = n * 10 + ch - '0'; 
        }
      else if (ch == ';'){
          if (nargs < ESC_ARGS)
            arg[nargs++] = n;
          n = -1;
        }
      else if (IS_CONTROL (ch))
//CMNT: c_keyword ^|               process_nonprinting (ch); 
        process_nonpring (ch);

      ch = cmd_getc ();
    }

  if (ch > CSI_7F)
    return;

  if (nargs < ESC_ARGS)
    arg[nargs++] = n;

  i = ch - CSI_ICH;
  ndef = get_byte_array_bit (csi_defaults, i);
  for (p = 0; p < nargs; p++)
    if (arg[p] == -1)
      arg[p] = ndef;

  /*
   * private mode handling 
   */
  if (priv){
      switch (priv){
          case '>':
            if (ch == CSI_DA)	/* secondary device attributes */
              {
                // first parameter is normally 0 for vt100, 1 for vt220, 'R' for rxvt,
                // 'U' for rxvt-unicode != 7.[34] (where it was broken).
                //
                // second parameter is xterm patch level for xterm, MMmmpp (e.g. 20703) for rxvt
                // and Mm (e.g. 72 for 7.2) for urxvt <= 7.2, 94 for urxvt <= 8.3, and 95 for later
                // versions.
                //
//CMNT: c_keyword ^|                       tt_printf ("\033[>%d;95;0c", 'U'); 
                tt_prf ("\033[>%d;95;0c", 'U');
              }
            break;

          case '?':
            if (ch == 'h' || ch == 'l' || ch == 'r' || ch == 's' || ch == 't')
              process_terminal_mode (ch, priv, nargs, arg);
            break;

          case '!':
            if (ch == CSI_70){
                /* DECSTR: soft terminal reset, used by our terminfo since 9.06 */
                scr_soft_reset ();

//CMNT: js_style_variables js_style_arrays ^|                       static const int pm_h[] = { 7, 25 }; 
 var pm_h= [ 7, 25 ] ; 
//CMNT: js_style_variables js_style_arrays ^|                       static const int pm_l[] = { 1, 3, 4, 5, 6, 9, 66, 1000, 1001, 1049 }; 
 var pm_l= [ 1, 3, 4, 5, 6, 9, 66, 1000, 1001, 1049 ] ; 

                process_terminal_mode ('h', 0, sizeof (pm_h) / sizeof (pm_h[0]), pm_h);
                process_terminal_mode ('l', 0, sizeof (pm_l) / sizeof (pm_l[0]), pm_l);
              }
          break;
        }

      return;
    }

  switch (ch){
        /*
         * ISO/IEC 6429:1992 (E) CSI sequences (defaults in parentheses) 
         */
#ifdef PRINTPIPE
      case CSI_MC:		/* 8.3.83: (0) MEDIA COPY */
        switch (arg[0]){
            case 0:			/* initiate transfer to primary aux device */
//CMNT: c_keyword ^|                     scr_printscreen (0); 
              scr_prscreen (0);
              break;
            case 5:			/* start relay to primary aux device */
//CMNT: c_keyword ^|                     process_print_pipe (); 
              process_pr_pipe ();
              break;
          }
        break;
#endif

      case CSI_CUU:		/* 8.3.22: (1) CURSOR UP */
      case CSI_VPR:		/* 8.3.161: (1) LINE POSITION FORWARD */
        arg[0] = -arg[0];
        /* FALLTHROUGH */
      case CSI_CUD:		/* 8.3.19: (1) CURSOR DOWN */
      case CSI_VPB:		/* 8.3.160: (1) LINE POSITION BACKWARD */
        scr_gotorc (arg[0], 0, RELATIVE);
        break;

      case CSI_CUB:		/* 8.3.18: (1) CURSOR LEFT */
      case CSI_HPB: 		/* 8.3.59: (1) CHARACTER POSITION BACKWARD */
#ifdef ISO6429
        arg[0] = -arg[0];
#else				/* emulate common DEC VTs */
        arg[0] = arg[0] ? -arg[0] : -1;
#endif
        /* FALLTHROUGH */
      case CSI_CUF:		/* 8.3.20: (1) CURSOR RIGHT */
      case CSI_HPR:		/* 8.3.60: (1) CHARACTER POSITION FORWARD */
#ifdef ISO6429
        scr_gotorc (0, arg[0], RELATIVE);
#else				/* emulate common DEC VTs */
        scr_gotorc (0, arg[0] ? arg[0] : 1, RELATIVE);
#endif
        break;

      case CSI_CPL:		/* 8.3.13: (1) CURSOR PRECEDING LINE */
        arg[0] = -arg[0];
        /* FALLTHROUGH */
      case CSI_CNL:		/* 8.3.12: (1) CURSOR NEXT LINE */
        scr_gotorc (arg[0], 0, R_RELATIVE);
        break;

      case CSI_CHA:		/* 8.3.9: (1) CURSOR CHARACTER ABSOLUTE */
      case CSI_HPA:		/* 8.3.58: (1) CURSOR POSITION ABSOLUTE */
        scr_gotorc (0, arg[0] - 1, R_RELATIVE);
        break;

      case CSI_VPA:		/* 8.3.159: (1) LINE POSITION ABSOLUTE */
        scr_gotorc (arg[0] - 1, 0, C_RELATIVE);
        break;

      case CSI_CUP:		/* 8.3.21: (1,1) CURSOR POSITION */
      case CSI_HVP:		/* 8.3.64: (1,1) CHARACTER AND LINE POSITION */
        scr_gotorc (arg[0] - 1, nargs < 2 ? 0 : (arg[1] - 1), 0);
        break;

      case CSI_CBT:		/* 8.3.7: (1) CURSOR BACKWARD TABULATION */
        arg[0] = -arg[0];
        /* FALLTHROUGH */
      case CSI_CHT:		/* 8.3.10: (1) CURSOR FORWARD TABULATION */
        scr_tab (arg[0]);
        break;

      case CSI_ED:		/* 8.3.40: (0) ERASE IN PAGE */
        scr_erase_screen (arg[0]);
        break;

      case CSI_EL:		/* 8.3.42: (0) ERASE IN LINE */
        scr_erase_line (arg[0]);
        break;

      case CSI_ICH:		/* 8.3.65: (1) INSERT CHARACTER */
//CMNT: c_keyword ^|               scr_insdel_chars (arg[0], INSERT); 
        scr_insdel_s (arg[0], INSERT);
        break;

      case CSI_IL:		/* 8.3.68: (1) INSERT LINE */
        scr_insdel_lines (arg[0], INSERT);
        break;

      case CSI_DL:		/* 8.3.33: (1) DELETE LINE */
        scr_insdel_lines (arg[0], DELETE);
        break;

      case CSI_ECH:		/* 8.3.39: (1) ERASE CHARACTER */
//CMNT: c_keyword ^|               scr_insdel_chars (arg[0], ERASE); 
        scr_insdel_s (arg[0], ERASE);
        break;

      case CSI_DCH:		/* 8.3.26: (1) DELETE CHARACTER */
//CMNT: c_keyword ^|               scr_insdel_chars (arg[0], DELETE); 
        scr_insdel_s (arg[0], DELETE);
        break;

      case CSI_SD:		/* 8.3.114: (1) SCROLL DOWN */
        arg[0] = -arg[0];
        /* FALLTHROUGH */
      case CSI_SU:		/* 8.3.148: (1) SCROLL UP */
        scr_scroll_text (screen.tscroll, screen.bscroll, arg[0]);
        break;

      case CSI_DA:		/* 8.3.24: (0) DEVICE ATTRIBUTES */
        tt_write (VT100_ANS, sizeof (VT100_ANS) - 1);
        break;

      case CSI_SGR:		/* 8.3.118: (0) SELECT GRAPHIC RENDITION */
        process_sgr_mode (nargs, arg);
        break;

      case CSI_DSR:		/* 8.3.36: (0) DEVICE STATUS REPORT */
        switch (arg[0]){
            case 5:			/* DSR requested */
//CMNT: c_keyword ^|                     tt_printf ("\033[0n"); 
              tt_prf ("\033[0n");
              break;
            case 6:			/* CPR requested */
              scr_report_position ();
              break;
            case 7:			/* unofficial extension */
              if (option (Opt_insecure))
//CMNT: c_keyword ^|                       tt_printf ("%-.250s\012", rs[Rs_display_name]); 
                tt_prf ("%-.250s\012", rs[Rs_display_name]);
              break;
            case 8:			/* unofficial extension */
              process_xterm_seq (XTerm_title, RESNAME "-" VERSION, CHAR_ST);
              break;
          }
        break;

      case CSI_TBC:		/* 8.3.155: (0) TABULATION CLEAR */
        switch (arg[0]){
//CMNT: c_keyword ^|                   case 0:			/* char tab stop cleared at active position */ 
            case 0:			/*  tab stop cleared at active position */
              scr_set_tab (0);
              break;
              /* case 1: */		/* line tab stop cleared in active line */
//CMNT: c_keyword ^|                     /* case 2: */		/* char tab stops cleared in active line */ 
              /* case 2: */		/*  tab stops cleared in active line */
//CMNT: c_keyword ^|                   case 3:			/* all char tab stops are cleared */ 
            case 3:			/* all  tab stops are cleared */
              /* case 4: */		/* all line tab stops are cleared */
            case 5:			/* all tab stops are cleared */
              scr_set_tab (-1);
              break;
          }
        break;

      case CSI_CTC:		/* 8.3.17: (0) CURSOR TABULATION CONTROL */
        switch (arg[0]){
//CMNT: c_keyword ^|                   case 0:			/* char tab stop set at active position */ 
            case 0:			/*  tab stop set at active position */
              scr_set_tab (1);
              break;		/* = ESC H */
              /* case 1: */		/* line tab stop set at active line */
//CMNT: c_keyword ^|                   case 2:			/* char tab stop cleared at active position */ 
            case 2:			/*  tab stop cleared at active position */
              scr_set_tab (0);
              break;		/* = ESC [ 0 g */
              /* case 3: */		/* line tab stop cleared at active line */
//CMNT: c_keyword ^|                     /* case 4: */		/* char tab stops cleared at active line */ 
              /* case 4: */		/*  tab stops cleared at active line */
//CMNT: c_keyword ^|                   case 5:			/* all char tab stops are cleared */ 
            case 5:			/* all  tab stops are cleared */
              scr_set_tab (-1);
              break;		/* = ESC [ 3 g */
              /* case 6: */		/* all line tab stops are cleared */
          }
        break;

      case CSI_RM:		/* 8.3.107: RESET MODE */
        if (arg[0] == 4)
          scr_insert_mode (0);
        else if (arg[0] == 20)
          priv_modes &= ~PrivMode_LFNL;
        break;

      case CSI_SM:		/* 8.3.126: SET MODE */
        if (arg[0] == 4)
          scr_insert_mode (1);
        else if (arg[0] == 20)
          priv_modes |= PrivMode_LFNL;
        break;

        /*
         * PRIVATE USE beyond this point.  All CSI_7? sequences here 
         */
      case CSI_72:		/* DECSTBM: set top and bottom margins */
        if (nargs == 1)
          scr_scroll_region (arg[0] - 1, MAX_ROWS - 1);
        else if (nargs == 0 || arg[0] >= arg[1])
          scr_scroll_region (0, MAX_ROWS - 1);
        else
          scr_scroll_region (arg[0] - 1, arg[1] - 1);
        break;

      case CSI_73:
        scr_cursor (SAVE);
        break;
      case CSI_75:
        scr_cursor (RESTORE);
        break;

#if !ENABLE_MINIMAL
      case CSI_74:
        process_window_ops (arg, nargs);
        break;
#endif

      case CSI_78:		/* DECREQTPARM */
        if (arg[0] == 0 || arg[0] == 1)
//CMNT: c_keyword ^|                 tt_printf ("\033[%d;1;1;128;128;1;0x", arg[0] + 2); 
          tt_prf ("\033[%d;1;1;128;128;1;0x", arg[0] + 2);
        break;

      default:
        break;
    }
}
/*}}} */

#if !ENABLE_MINIMAL
/* ARGSUSED */
//CMNT: js_style_functions c_keyword possible_pointer ^|       void rxvt_term::process_window_ops (const int *args, unsigned int nargs){ 
rxvt_term.process_window_ops =function(   a rgs,   nargs){ 
//CMNT: c_keyword ^|         int x, y; 
   x, y;
  XWindowAttributes wattr;
  Window wdummy;

//CMNT: possible_pointer ^|         dLocal (Display *, dpy); 
  dLocal (Display  ,  dpy);

  if (nargs == 0)
    return;

  switch (args[0]){
      /*
       * commands 
       */
      case 1:			/* deiconify window */
        XMapWindow (dpy, parent[0]);
        break;
      case 2:			/* iconify window */
        XIconifyWindow (dpy, parent[0], display->screen);
        break;
      case 3:			/* set position (pixels) */
        XMoveWindow (dpy, parent[0], args[1], args[2]);
        break;
      case 4:			/* set size (pixels) */
//CMNT: c_keyword ^|               set_widthheight ((unsigned int)args[2], (unsigned int)args[1]); 
        set_widthheight (( )args[2], ( )args[1]);
        break;
      case 5:			/* raise window */
        XRaiseWindow (dpy, parent[0]);
        break;
      case 6:			/* lower window */
        XLowerWindow (dpy, parent[0]);
        break;
      case 7:			/* refresh window */
        scr_touch (true);
        break;
  case 8:			/* set size (chars) */ 
          set_widthheight (( ) (args[2]    fwidth), //set_widthheight ((unsigned int) (args[2] * fwidth),        ###  c_keyword possible_pointer
                           ( ) (args[1]    fheight)); //unsigned int) (args[1] * fheight));        ###  c_keyword possible_pointer
        break;

      //case 9: NYI, TODO, restore maximized window or maximize window
      default:
//CMNT: c_keyword ^|               if (args[0] >= 24)	/* set height (chars) */ 
        if (args[0] >= 24)	/* set height (s) */
//CMNT: c_keyword ^|                 set_widthheight ((unsigned int)width, 
          set_widthheight (( )width,
//CMNT: c_keyword possible_pointer ^|                                  (unsigned int) (args[1] * fheight)); 
                           ( ) (args[1]    fheight));
        break;

      /*
       * reports - some output format copied from XTerm 
       */
      case 11:			/* report window state */
        XGetWindowAttributes (dpy, parent[0], &wattr);
//CMNT: c_keyword ^|               tt_printf ("\033[%dt", wattr.map_state == IsViewable ? 1 : 2); 
        tt_prf ("\033[%dt", wattr.map_state == IsViewable ? 1 : 2);
        break;
      case 13:			/* report window position */
        XGetWindowAttributes (dpy, parent[0], &wattr);
        XTranslateCoordinates (dpy, parent[0], wattr.root,
                               -wattr.border_width, -wattr.border_width,
                               &x, &y, &wdummy);
//CMNT: c_keyword ^|               tt_printf ("\033[3;%d;%dt", x, y); 
        tt_prf ("\033[3;%d;%dt", x, y);
        break;
      case 14:			/* report window size (pixels) */
        XGetWindowAttributes (dpy, parent[0], &wattr);
//CMNT: c_keyword ^|               tt_printf ("\033[4;%d;%dt", wattr.height, wattr.width); 
        tt_prf ("\033[4;%d;%dt", wattr.height, wattr.width);
        break;
//CMNT: c_keyword ^|             case 18:			/* report text area size (chars) */ 
      case 18:			/* report text area size (s) */
//CMNT: c_keyword ^|               tt_printf ("\033[8;%d;%dt", nrow, ncol); 
        tt_prf ("\033[8;%d;%dt", nrow, ncol);
        break;
//CMNT: c_keyword ^|             case 19:			/* report window size (chars) */ 
      case 19:			/* report window size (s) */
//CMNT: c_keyword ^|               tt_printf ("\033[9;%d;%dt", nrow, ncol); 
        tt_prf ("\033[9;%d;%dt", nrow, ncol);
        break;
      case 20:			/* report icon label */
        {
//CMNT: c_keyword possible_pointer ^|                 char *s; 
            s ;
          XGetIconName (dpy, parent[0], &s);
//CMNT: c_keyword ^|                 tt_printf ("\033]L%-.250s\234", option (Opt_insecure) && s ? s : "");	/* 8bit ST */ 
          tt_prf ("\033]L%-.250s\234", option (Opt_insecure) && s ? s : "");	/* 8bit ST */
          XFree (s);
        }
        break;
      case 21:			/* report window title */
        {
//CMNT: c_keyword possible_pointer ^|                 char *s; 
            s ;
          XFetchName (dpy, parent[0], &s);
          tt_printf ("\033]l%-.250s\234", option (Opt_insecure) && s ? s : "");	/* 8bit ST */ 
          XFree (s);
        }
        break;
    }
}
#endif

/*----------------------------------------------------------------------*/
/*
 * get input up until STRING TERMINATOR (or BEL) 
 * ends_how is terminator used. returned input must be free()'d 
 */
//CMNT: c_keyword ^|       char * 
 *
//CMNT: js_style_functions c_keyword ^|       rxvt_term::get_to_st (unicode_t &ends_how){ 
rxvt_term.get_to_st =function(&ends_how){ 
//CMNT: c_keyword ^|         unicode_t ch; 
  ch;
  bool seen_esc = false;
//CMNT: c_keyword ^|         unsigned int n = 0; 
    n = 0;
//CMNT: c_keyword ^|         wchar_t string[STRING_MAX]; 
   string[STRING_MAX];

  while ((ch = cmd_getc ()) != NOCHAR){
      if (seen_esc){
          if (ch == 0x5c)	/* 7bit ST */
            break;
          else
            return NULL;
        }
      else if (ch == C0_ESC){
          seen_esc = true;
          continue;
        }
      else if (ch == C0_BEL || ch == CHAR_ST)
        break;
      else if (ch == C0_SYN)
        ch = cmd_get8 ();
      else if (ch < 0x20)
//CMNT: c_keyword ^|               return NULL;	/* other control character - exit */ 
        return NULL;	/* other control acter - exit */

      seen_esc = false;

      if (n >= STRING_MAX - 1)
        // stop at some sane length
        return NULL;

      string[n++] = ch;
    }

  string[n++] = '\0';

  ends_how = (ch == 0x5c ? C0_ESC : ch);

  return rxvt_wcstombs (string);
}

/*----------------------------------------------------------------------*/
/*
 * process DEVICE CONTROL STRING `ESC P ... (ST|BEL)' or `0x90 ... (ST|BEL)' 
 */
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::process_dcs_seq (){ 
rxvt_term.process_dcs_seq =function(){ 
//CMNT: c_keyword possible_pointer ^|         char *s; 
    s ;
//CMNT: c_keyword ^|         unicode_t eh; 
  eh;

  /*
   * Not handled yet 
   */
  s = get_to_st (eh);
  if (s)
    free (s);

  return;
}

/*----------------------------------------------------------------------*/
/*
 * process OPERATING SYSTEM COMMAND sequence `ESC ] Ps ; Pt (ST|BEL)' 
 */
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::process_osc_seq (){ 
rxvt_term.process_osc_seq =function(){ 
//CMNT: c_keyword ^|         unicode_t ch, eh; 
  ch, eh;
//CMNT: c_keyword ^|         int arg; 
   arg;

  ch = cmd_getc ();
  for (arg = 0; isdigit (ch); ch = cmd_getc ())
      arg = arg * 10 + (ch - '0'); 

  if (ch == ';'){
//CMNT: js_style_variables possible_pointer ^|             char *s = get_to_st (eh); 
 var s= get_to_st (eh); 

      if (s){
          process_xterm_seq (arg, s, eh);
          free (s);
        }
    }
}

//CMNT: js_style_functions c_keyword possible_pointer ^|       void rxvt_term::process_color_seq (int report, int color, const char *str, char resp){ 
rxvt_term.process_color_seq =function( report,  color,    s tr,  resp){ 
  if (str[0] == '?' && !str[1]){
      rgba c;
      pix_colors_focused[color].get (c);

#if XFT
      if (c.a != rgba::MAX_CC)
//CMNT: c_keyword ^|               tt_printf ("\033]%d;rgba:%04x/%04x/%04x/%04x%c", report, c.a, c.r, c.g, c.b, resp); 
        tt_prf ("\033]%d;rgba:%04x/%04x/%04x/%04x%c", report, c.a, c.r, c.g, c.b, resp);
      else
#endif
//CMNT: c_keyword ^|               tt_printf ("\033]%d;rgb:%04x/%04x/%04x%c", report, c.r, c.g, c.b, resp); 
        tt_prf ("\033]%d;rgb:%04x/%04x/%04x%c", report, c.r, c.g, c.b, resp);
    }
  else
    set_window_color (color, str);
}

/*
 * XTerm escape sequences: ESC ] Ps;Pt (ST|BEL) 
 */
//CMNT: js_style_functions c_keyword possible_pointer ^|       void rxvt_term::process_xterm_seq (int op, const char *str, char resp){ 
rxvt_term.process_xterm_seq =function( op,    s tr,  resp){ 
//CMNT: c_keyword ^|         int color; 
   color;
//CMNT: c_keyword possible_pointer ^|         char *buf, *name; 
    b uf,  n ame;
  bool query = str[0] == '?' && !str[1];
//CMNT: js_style_variables ^|         int saveop = op; 
 var saveop= op; 

//CMNT: possible_pointer ^|         dLocal (Display *, dpy); 
  dLocal (Display  ,  dpy);

  assert (str != NULL);

  if (HOOK_INVOKE ((this, HOOK_OSC_SEQ, DT_INT, op, DT_STR, str, DT_END)))
    return;

  switch (op){
      case XTerm_name:
        set_title (str);
        /* FALLTHROUGH */
      case XTerm_iconName:
        set_icon_name (str);
        break;
      case XTerm_title:
        set_title (str);
        break;
      case XTerm_property:
        if (str[0] == '?'){
            Atom prop = display->atom (str + 1);
            Atom actual_type;
//CMNT: c_keyword ^|                   int actual_format; 
             actual_format;
//CMNT: c_keyword ^|                   unsigned long nitems; 
             long nitems;
//CMNT: c_keyword ^|                   unsigned long bytes_after; 
             long bytes_after;
//CMNT: c_keyword possible_pointer ^|                   unsigned char *value = 0; 
               v alue = 0;
//CMNT: c_keyword possible_pointer ^|                   const char *str = ""; 
               s tr = "";

            if (prop
                && XGetWindowProperty (dpy, parent[0],
                                       prop, 0, 1<<16, 0, AnyPropertyType,
                                       &actual_type, &actual_format,
                                       &nitems, &bytes_after, &value) == Success
                && actual_type != None
                && actual_format == 8)
//CMNT: c_keyword possible_pointer ^|                     str = (const char *)(value); 
              str = (   ) (value);

//CMNT: c_keyword ^|                   tt_printf ("\033]%d;%s%c", op, str, resp); 
            tt_prf ("\033]%d;%s%c", op, str, resp);

            XFree (value);
          }
        else{
//CMNT: c_keyword possible_pointer ^|                   char *eq = strchr (str, '='); // constness lost, but verified to be ok 
              e q = strchr (str, '='); // ness lost, but verified to be ok

            if (eq){
//CMNT: possible_pointer ^|                       *eq = 0; 
                 e q = 0;
                set_utf8_property (display->atom (str), eq + 1);
              }
            else
              XDeleteProperty (dpy, parent[0],
                               display->atom (str));
          }
        break;

      case XTerm_Color:
//CMNT: c_keyword possible_pointer ^|               for (buf = (char *)str; buf && *buf;){ 
        for (buf = (  ) str; buf &&  b uf;){
            if ((name = strchr (buf, ';')) == NULL)
              break;

//CMNT: possible_pointer ^|                   *name++ = '\0'; 
             n ame++ = '\0';
            color = atoi (buf) + minCOLOR;

            if (!IN_RANGE_INC (color, minCOLOR, maxTermCOLOR))
              break;

            if ((buf = strchr (name, ';')) != NULL)
//CMNT: possible_pointer ^|                     *buf++ = '\0'; 
               b uf++ = '\0';

            process_color_seq (op, color, name, resp);
          }
        break;
      case Rxvt_restoreFG:
      case XTerm_Color00:
        process_color_seq (op, Color_fg, str, resp);
        break;
      case Rxvt_restoreBG:
      case XTerm_Color01:
        process_color_seq (op, Color_bg, str, resp);
        break;
#ifndef NO_CURSORCOLOR
      case XTerm_Color_cursor:
        process_color_seq (op, Color_cursor, str, resp);
        break;
#endif
  case XTerm_Color_pointer_fg: 
        process_color_seq (op, Color_pointer_fg, str, resp); 
        break;
  case XTerm_Color_pointer_bg: 
      process_color_seq (op, Color_pointer_bg, str, resp); 
        break;
#ifndef NO_BOLD_UNDERLINE_REVERSE
      case XTerm_Color_RV:
        process_color_seq (op, Color_RV, str, resp);
        break;
      case Rxvt_Color_BD:
      case URxvt_Color_BD:
        process_color_seq (op, Color_BD, str, resp);
        break;
      case Rxvt_Color_UL:
      case URxvt_Color_UL:
        process_color_seq (op, Color_UL, str, resp);
        break;
      case URxvt_Color_IT:
        process_color_seq (op, Color_IT, str, resp);
        break;
#endif
      case URxvt_Color_border:
        process_color_seq (op, Color_border, str, resp);
        break;
#if ENABLE_TRANSPARENCY
//CMNT: c_keyword ^|             case URxvt_Color_tint: 
      case URxvt_Color_t:
//CMNT: c_keyword ^|               process_color_seq (op, Color_tint, str, resp); 
        process_color_seq (op, Color_t, str, resp);
        {
          bool changed = false;

//CMNT: c_keyword ^|                 if (ISSET_PIXCOLOR (Color_tint)) 
          if (ISSET_PIXCOLOR (Color_t))
//CMNT: c_keyword ^|                   changed = bgPixmap.set_tint (pix_colors_focused [Color_tint]); 
            changed = bgPixmap.set_t (pix_colors_focused [Color_t]);
          else
//CMNT: c_keyword ^|                   changed = bgPixmap.unset_tint (); 
            changed = bgPixmap.unset_t ();

          if (changed)
            update_background ();
        }

        break;
#endif

#if BG_IMAGE_FROM_FILE
      case Rxvt_Pixmap:
        if (!strcmp (str, "?")){
//CMNT: c_keyword ^|                   char str[256]; 
             str[256];

//CMNT: c_keyword ^|                   sprintf (str, "[%dx%d+%d+%d]",	/* can't presume snprintf () ! */ 
            sprf (str, "[%dx%d+%d+%d]",	/* can't presume snprf () ! */
                     min (bgPixmap.h_scale, 32767), min (bgPixmap.v_scale, 32767),
                     min (bgPixmap.h_align, 32767), min (bgPixmap.v_align, 32767));
            process_xterm_seq (XTerm_title, str, CHAR_ST);
          }
        else{
//CMNT: js_style_variables ^|                   int changed = 0; 
 var changed= 0; 

//CMNT: possible_pointer ^|                   if (*str != ';'){ 
            if ( s tr != ';'){
                /* reset to default scaling :*/
                bgPixmap.unset_geometry ();
                if (bgPixmap.set_file (str))	/* change pixmap */
                  changed++;
                str = strchr (str, ';');
                if (str == NULL)
                  bgPixmap.set_defaultGeometry ();
              }

            while (str){
                str++;
                if (bgPixmap.set_geometry (str))
                  changed++;
                str = strchr (str, ';');
              }

            if (changed)
              update_background ();
          }
        break;
#endif

      case XTerm_logfile:
        // TODO, when secure mode?
        break;

#if 0
      case Rxvt_dumpscreen:	/* no error notices */
        {
//CMNT: c_keyword ^|                 int fd; 
           fd;
          if ((fd = open (str, O_RDWR | O_CREAT | O_EXCL, 0600)) >= 0){
              scr_dump (fd);
              close (fd);
            }
        }
        break;
#endif
      case XTerm_font:
        op = URxvt_font;
      case URxvt_font:
#if ENABLE_STYLES
      case URxvt_boldFont:
      case URxvt_italicFont:
      case URxvt_boldItalicFont:
#endif
        if (query)
//CMNT: c_keyword ^|                 tt_printf ("\33]%d;%-.250s%c", saveop, 
          tt_prf ("\33]%d;%-.250s%c", saveop,
                     option (Opt_insecure) && fontset[op - URxvt_font]->fontdesc
                       ? fontset[op - URxvt_font]->fontdesc : "",
                     resp);
        else{
//CMNT: c_keyword possible_pointer ^|                   const char *&res = rs[Rs_font + (op - URxvt_font)]; 
               & res = rs[Rs_font + (op - URxvt_font)];

            res = strdup (str);
//CMNT: c_keyword possible_pointer ^|                   allocated.push_back ((void *)res); 
            allocated.push_back ((  ) res);
            set_fonts ();
          }
        break;

      case URxvt_version:
        if (query)
//CMNT: c_keyword ^|                 tt_printf ("\33]%d;rxvt-unicode;%-.20s;%c;%c%c", 
          tt_prf ("\33]%d;rxvt-unicode;%-.20s;%c;%c%c",
                     op,
                     rs[Rs_name], VERSION[0], VERSION[2],
                     resp);
        break;

#if !ENABLE_MINIMAL
      case URxvt_locale:
        if (query)
//CMNT: c_keyword ^|                 tt_printf ("\33]%d;%-.250s%c", op, option (Opt_insecure) ? locale : "", resp); 
          tt_prf ("\33]%d;%-.250s%c", op, option (Opt_insecure) ? locale : "", resp);
        else{
            set_locale (str);
            pty->set_utf8_mode (enc_utf8);
            init_xlocale ();
          }
        break;

      case URxvt_view_up:
      case URxvt_view_down:
        {
//CMNT: js_style_variables ^|                 int lines = atoi (str); 
 var lines= atoi (str); 

          if (lines)
            scr_page (op == URxvt_view_up ? UP : DN, lines);
          else
            scr_erase_savelines ();
        }

        break;
#endif

#if ENABLE_PERL
      case URxvt_perl:
        HOOK_INVOKE ((this, HOOK_OSC_SEQ_PERL, DT_STR, str, DT_STR_LEN, &resp, 1, DT_END));
        break;
#endif
    }
}
/*----------------------------------------------------------------------*/

/*{{{ process DEC private mode sequences `ESC [ ? Ps mode' */
/*
 * mode can only have the following values: 
 *      'l' = low 
 *      'h' = high 
 *      's' = save 
 *      'r' = restore 
 *      't' = toggle 
 * so no need for fancy checking 
 */
//CMNT: js_style_functions c_keyword ^|       int rxvt_term::privcases (int mode, unsigned long bit){ 
rxvt_term.privcases =function( mode,  long bit){ 
//CMNT: c_keyword ^|         int state; 
   state;

  if (mode == 's'){
      SavedModes |= (priv_modes & bit);
      return -1;
    }
  else{
      if (mode == 'r')
        state = (SavedModes & bit) ? 1 : 0;	/* no overlapping */
      else
        state = (mode == 't') ? ! (priv_modes & bit) : mode;
      set_privmode (bit, state);
    }

  return state;
}

/* we're not using priv _yet_ */
//CMNT: js_style_functions c_keyword possible_pointer ^|       void rxvt_term::process_terminal_mode (int mode, int priv UNUSED, unsigned int nargs, const int *arg){ 
rxvt_term.process_terminal_mode =function( mode,  priv UNUSED,   nargs,    a rg){ 
//CMNT: c_keyword ^|         unsigned int i, j; 
    i, j;
//CMNT: c_keyword ^|         int state; 
   state;

//CMNT: c_keyword ^|         static const struct 
    struct
  {
//CMNT: c_keyword ^|           const int       argval; 
            argval;
//CMNT: c_keyword ^|           const unsigned long bit; 
      long bit;
  } argtopriv[] = {
                  { 1, PrivMode_aplCUR },       // DECCKM
                  { 2, PrivMode_vt52 },
                  { 3, PrivMode_132 },          // DECCOLM
                  { 4, PrivMode_smoothScroll }, // DECSCLM
                  { 5, PrivMode_rVideo },       // DECSCNM
                  { 6, PrivMode_relOrigin },    // DECOM
                  { 7, PrivMode_Autowrap },     // DECAWM
                 // 8, auto-repeat keys         // DECARM
                  { 9, PrivMode_MouseX10 },
//CMNT: c_keyword ^|                        // 18 end FF to printer after print screen 
                 // 18 end FF to prer after pr screen
//CMNT: c_keyword ^|                        // 19 Print screen prints full screen/scorll region 
                 // 19 Pr screen prs full screen/scorll region
                  { 25, PrivMode_VisibleCursor }, // cnorm/cvvis/civis
#ifdef scrollBar_esc
                  { scrollBar_esc, PrivMode_scrollBar },
#endif
                  { 35, PrivMode_ShiftKeys },   // rxvt extension
                 // 38, tektronix mode          // DECTEK
                  { 40, PrivMode_132OK },
                 // 41 xterm more fixes NYI
                 // 45 margin bell NYI
                 // 46 start logging
                  { 47, PrivMode_Screen },
                  { 66, PrivMode_aplKP },       // DECPAM/DECPNM
#ifndef NO_BACKSPACE_KEY
                  { 67, PrivMode_BackSpace },   // DECBKM
#endif
                  { 1000, PrivMode_MouseX11 },
                  { 1002, PrivMode_MouseBtnEvent },
                  { 1003, PrivMode_MouseAnyEvent },
                  { 1010, PrivMode_TtyOutputInh }, // rxvt extension
                  { 1011, PrivMode_Keypress }, // rxvt extension
                 // 1035 enable modifiers for alt, numlock NYI
                 // 1036 send ESC for meta keys NYI
                 // 1037 send DEL for keypad delete NYI
                  { 1047, PrivMode_Screen },
                 // 1048 save and restore cursor
                  { 1049, PrivMode_Screen }, /* xterm extension, clear screen on ti rather than te */
                 // 1051, 1052, 1060, 1061 keyboard emulation NYI
                  { 2004, PrivMode_BracketPaste },
                };

  if (nargs == 0)
    return;

  /* make lo/hi boolean */
  if (mode == 'l')
    mode = 0;		/* reset */
  else if (mode == 'h')
    mode = 1;		/* set */

  for (i = 0; i < nargs; i++){
      state = -1;

      /* basic handling */
      for (j = 0; j < (sizeof (argtopriv)/sizeof (argtopriv[0])); j++)
        if (argtopriv[j].argval == arg[i]){
            state = privcases (mode, argtopriv[j].bit);
            break;
          }

      /* extra handling for values with state unkept  */
      switch (arg[i]){
#if ENABLE_STYLES
          case 1021:
//CMNT: c_keyword ^|                   set_option (Opt_intensityStyles, mode); 
            set_option (Opt_ensityStyles, mode);

            scr_touch (true);
            break;
#endif
          case 1048:		/* alternative cursor save */
            if (option (Opt_secondaryScreen))
              if (mode == 0)
                scr_cursor (RESTORE);
              else if (mode == 1)
                scr_cursor (SAVE);
            break;
        }

      if (state >= 0)
        /* extra handling for values with valid 0 or 1 state */
        switch (arg[i]){
              /* case 1:	- application cursor keys */
            case 2:			/* VT52 mode */
              /* oddball mode.  should be set regardless of set/reset
               * parameter.  Return from VT52 mode with an ESC < from 
               * within VT52 mode 
               */
              set_privmode (PrivMode_vt52, 1);
              break;
            case 3:			/* 80/132 */
              if (priv_modes & PrivMode_132OK)
                  set_widthheight ((state ? 132 : 80) * fwidth, 24 * fheight); 
              break;
            case 4:			/* smooth scrolling */
              set_option (Opt_jumpScroll, !state);
              break;
            case 5:			/* reverse video */
              scr_rvideo_mode (state);
              break;
            case 6:			/* relative/absolute origins  */
              scr_relative_origin (state);
              break;
            case 7:			/* autowrap */
              scr_autowrap (state);
              break;
            /* case 8:	- auto repeat, can't do on a per window basis */
            case 9:			/* X10 mouse reporting */
              if (state)		/* orthogonal */
                priv_modes &= ~(PrivMode_MouseX11|PrivMode_MouseBtnEvent|PrivMode_MouseAnyEvent);
              break;
#ifdef scrollBar_esc
            case scrollBar_esc:
              if (scrollBar.map (state)){
                  resize_all_windows (0, 0, 0);
                  scr_touch (true);
                }
              break;
#endif
            case 25:		/* visible/invisible cursor */
              scr_cursor_visible (state);
              break;
            /* case 35:	- shift keys */
            /* case 40:	- 80 <--> 132 mode */
            case 47:		/* secondary screen */
              scr_change_screen (state);
              break;
            /* case 66:	- application key pad */
            /* case 67:	- backspace key */
            case 1000:		/* X11 mouse reporting */
              if (state)		/* orthogonal */
                priv_modes &= ~(PrivMode_MouseX10|PrivMode_MouseBtnEvent|PrivMode_MouseAnyEvent);
              break;
            case 1002:
            case 1003:
              if (state){
                  priv_modes &= ~(PrivMode_MouseX10|PrivMode_MouseX11);
                  priv_modes &= arg[i] == 1003 ? ~PrivMode_MouseBtnEvent : ~PrivMode_MouseAnyEvent;
                  vt_emask_mouse = PointerMotionMask; 
                }
              else
                vt_emask_mouse = NoEventMask;

              vt_select_input ();
              break;
            case 1010:		/* scroll to bottom on TTY output inhibit */
              set_option (Opt_scrollTtyOutput, !state);
              break;
            case 1011:		/* scroll to bottom on key press */
              set_option (Opt_scrollTtyKeypress, state);
              break;
            case 1047:		/* secondary screen w/ clearing last */
              if (option (Opt_secondaryScreen))
                if (!state)
                  scr_erase_screen (2);

              scr_change_screen (state);
              break;
            case 1049:		/* secondary screen w/ clearing first */
              if (option (Opt_secondaryScreen))
                if (state)
                  scr_cursor (SAVE);

              scr_change_screen (state);

              if (option (Opt_secondaryScreen))
                if (state)
                  scr_erase_screen (2);
                else
                  scr_cursor (RESTORE);
              break;
            default:
              break;
          }
    }
}
/*}}} */

/*{{{ process sgr sequences */
//CMNT: js_style_functions c_keyword possible_pointer ^|       void rxvt_term::process_sgr_mode (unsigned int nargs, const int *arg){ 
rxvt_term.process_sgr_mode =function(  nargs,    a rg){ 
//CMNT: c_keyword ^|         unsigned int i; 
    i;
//CMNT: c_keyword ^|         short rendset; 
   rendset;
//CMNT: c_keyword ^|         int rendstyle; 
   rendstyle;

  if (nargs == 0){
      scr_rendition (0, ~RS_None);
      return;
    }

  for (i = 0; i < nargs; i++){
      rendset = -1;
      switch (arg[i]){
          case 0:
            rendset = 0, rendstyle = ~RS_None;
            break;
          case 1:
            rendset = 1, rendstyle = RS_Bold;
            break;
//CMNT: c_keyword ^|                 //case 2: // low intensity 
          //case 2: // low ensity
          case 3:
            rendset = 1, rendstyle = RS_Italic;
            break;
          case 4:
            rendset = 1, rendstyle = RS_Uline;
            break;
          case 5: // slowly blinking
          case 6: // rapidly blinking
            rendset = 1, rendstyle = RS_Blink;
            break;
          //case 6: // scoansi light background
          case 7:
            rendset = 1, rendstyle = RS_RVid;
            break;
          case 8:
            // invisible. NYI
            break;
          //case 9: // crossed out
          //case 10: // scoansi acs off, primary font
          //case 11: // scoansi acs on, first alt font
          //case 12: // scoansi acs on, |0x80, second alt font
          //...
          //case 19: // ninth alt font 
          //case 20: // gothic
      case 21: // disable bold, faint, sometimes doubly underlined (iso 8613) 
            rendset = 0, rendstyle = RS_Bold;
            break;
      case 22: // normal intensity 
            rendset = 0, rendstyle = RS_Bold;
            break;
          case 23: // disable italic
            rendset = 0, rendstyle = RS_Italic;
            break;
          case 24:
            rendset = 0, rendstyle = RS_Uline;
            break;
          case 25:
            rendset = 0, rendstyle = RS_Blink;
            break;
          case 26: // variable spacing (iso 8613)
            rendset = 0, rendstyle = RS_Blink;
            break;
          case 27:
            rendset = 0, rendstyle = RS_RVid;
            break;
          //case 28: // visible. NYI
          //case 29: // not crossed-out
        }

      if (rendset != -1){
          scr_rendition (rendset, rendstyle);
          continue;		/* for (;i;) */
        }

      switch (arg[i]){
          case 30:
          case 31:		/* set fg color */
          case 32:
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
//CMNT: c_keyword ^|                   scr_color ((unsigned int) (minCOLOR + (arg[i] - 30)), Color_fg); 
            scr_color (( ) (minCOLOR + (arg[i] - 30)), Color_fg);
            break;
          case 38: // set fg color, ISO 8613-6
            if (nargs > i + 2 && arg[i + 1] == 5){
//CMNT: c_keyword ^|                       scr_color ((unsigned int) (minCOLOR + arg[i + 2]), Color_fg); 
                scr_color (( ) (minCOLOR + arg[i + 2]), Color_fg);
                i += 2;
              }
            break;
          case 39:		/* default fg */
            scr_color (Color_fg, Color_fg);
            break;

          case 40:
          case 41:		/* set bg color */
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
//CMNT: c_keyword ^|                   scr_color ((unsigned int) (minCOLOR + (arg[i] - 40)), Color_bg); 
            scr_color (( ) (minCOLOR + (arg[i] - 40)), Color_bg);
            break;
          case 48: // set bg color, ISO 8613-6
            if (nargs > i + 2 && arg[i + 1] == 5){
//CMNT: c_keyword ^|                       scr_color ((unsigned int) (minCOLOR + arg[i + 2]), Color_bg); 
                scr_color (( ) (minCOLOR + arg[i + 2]), Color_bg);
                i += 2;
              }
            break;
          case 49:		/* default bg */
            scr_color (Color_bg, Color_bg);
            break;

          //case 50: // not variable spacing

#if !ENABLE_MINIMAL
          case 90:
          case 91:		/* set bright fg color */
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 97:
//CMNT: c_keyword ^|                   scr_color ((unsigned int) (minBrightCOLOR + (arg[i] - 90)), Color_fg); 
            scr_color (( ) (minBrightCOLOR + (arg[i] - 90)), Color_fg);
            break;
          case 100:
          case 101:		/* set bright bg color */
          case 102:
          case 103:
          case 104:
          case 105:
          case 106:
          case 107:
//CMNT: c_keyword ^|                   scr_color ((unsigned int) (minBrightCOLOR + (arg[i] - 100)), Color_bg); 
            scr_color (( ) (minBrightCOLOR + (arg[i] - 100)), Color_bg);
            break;
#endif
        }
    }
}
/*}}} */

/*{{{ (do not) process Rob Nation's own graphics mode sequences */
//CMNT: js_style_functions c_keyword ^|       void rxvt_term::process_graphics (){ 
rxvt_term.process_graphics =function(){ 
//CMNT: c_keyword ^|         unicode_t ch, cmd = cmd_getc (); 
  ch, cmd = cmd_getc ();

  if (cmd == 'Q'){
      /* query graphics */
    tt_printf ("\033G0\012");	/* no graphics */ 
      return;
    }
  /* swallow other graphics sequences until terminating ':' */
  do
    ch = cmd_getc ();
  while (ch != ':');
}
/*}}} */

/* ------------------------------------------------------------------------- */

/*
 * Send printf () formatted output to the command. 
 * Only use for small amounts of data. 
 */
//CMNT: js_style_functions c_keyword possible_pointer ^|       void rxvt_term::tt_printf (const char *fmt,...){ 
rxvt_term.tt_prf =function(   fmt,...){ 
  va_list arg_ptr;
//CMNT: c_keyword ^|         char buf[256]; 
   buf[256];

  va_start (arg_ptr, fmt);
//CMNT: c_keyword possible_pointer ^|         vsnprintf ((char *)buf, 256, fmt, arg_ptr); 
  vsnprf ((  ) buf, 256, fmt, arg_ptr);
  va_end (arg_ptr);
  tt_write (buf, strlen (buf));
}

/* ---------------------------------------------------------------------- */
/* Write data to the pty as typed by the user, pasted with the mouse,
 * or generated by us in response to a query ESC sequence. 
 */
//CMNT: c_keyword ^|       const unsigned int MAX_PTY_WRITE = 255; // minimum MAX_INPUT 
   MAX_PTY_WRITE = 255; // minimum MAX_INPUT

//CMNT: js_style_functions c_keyword possible_pointer ^|       void rxvt_term::tt_write (const char *data, unsigned int len){ 
rxvt_term.tt_write =function(   data,   len){ 
  if (HOOK_INVOKE ((this, HOOK_TT_WRITE, DT_STR_LEN, data, len, DT_END)))
    return;

  if (pty->pty < 0)
    return;

  if (v_buflen == 0){
      ssize_t written = write (pty->pty, data, min (len, MAX_PTY_WRITE));

      if (( )written == len) //if ((unsigned int)written == len)        ###  c_keyword
        return;

      data += written;
      len  -= written;
    }

//CMNT: c_keyword possible_pointer ^|         v_buffer = (char *)realloc (v_buffer, v_buflen + len); 
  v_buffer = (  ) realloc (v_buffer, v_buflen + len);

  memcpy (v_buffer + v_buflen, data, len);
  v_buflen += len;

  pty_ev.set (ev::READ | ev::WRITE);
}

//CMNT: js_style_functions c_keyword ^|       void rxvt_term::pty_write (){ 
rxvt_term.pty_write =function(){ 
//CMNT: js_style_variables ^|         int written = write (pty->pty, v_buffer, min (v_buflen, MAX_PTY_WRITE)); 
 var written= write (pty->pty, v_buffer, min (v_buflen, MAX_PTY_WRITE)); 

  if (written > 0){
      v_buflen -= written;

      if (v_buflen == 0){
          free (v_buffer);
          v_buffer = 0;

          pty_ev.set (ev::READ);
          return;
        }

      memmove (v_buffer, v_buffer + written, v_buflen);
    }
  else if (written != -1 || (errno != EAGAIN && errno != EINTR))
    pty_ev.set (ev::READ);
}

/*----------------------- end-of-file (C source) -----------------------*/
