
## vim golang ide

```bash


root@golang-ide-ubuntu:/commander-operator# cat /root/.vimrc 
set nocompatible              " be iMproved, required
filetype off                  " required
set  columns=120  " lines=80
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'VundleVim/Vundle.vim'  "不能删除，删除执行clean有问题

Plugin 'tpope/vim-fugitive'

" Plugin 'git://git.wincent.com/command-t.git'
" Plugin 'morhetz/gruvbox' "不兼容

Plugin 'fatih/vim-go'

Plugin 'preservim/nerdtree' " 树形nav

Plugin 'SirVer/ultisnips' "自动补全, class

Plugin 'honza/vim-snippets' "自动补全

Plugin 'tomasr/molokai' " 主题

Plugin 'majutsushi/tagbar' "大纲视图
Plugin 'Raimondi/delimitMate' " 自动补全引号(单引号/双引号/反引号)

Plugin 'Valloric/YouCompleteMe'  " 自动补全,method
Plugin 'scrooloose/syntastic'

Plugin 'leafOfTree/vim-vue-plugin'
Plugin 'Chiel92/vim-autoformat'


call vundle#end()            " required



filetype plugin indent on    " required


nnoremap <F3> :NERDTreeToggle<CR>   " nerdtree 快捷键                                                                                                                                                                   
let NERDTreeIgnore=['\.pyc','\~$','\.swp','\.git']
autocmd bufenter * nested if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif  "退出vim自动关闭tree
autocmd VimEnter * NERDTree  | wincmd p  "自动开启nerdtree



syntax on

set t_Co=256
 

highlight CursorLine guibg=lightblue ctermbg=lightgray
set cursorline




colorscheme molokai
let g:molokai_original = 1

let g:rehash256 = 1

let g:go_metalinter_enabled = ['vet', 'golint', 'errcheck']

let g:go_metalinter_autosave = 1



" highlight CursorColumn guibg=#104040 


" autocmd vimenter * ++nested colorscheme gruvbox
" set bg=dark

" colorscheme gruvbox
" set background=dark    " Setting dark mode



set backspace=2  "allow delete                                                                                                                                      



set autowriteall
set autoread
map <C-n> :cnext<CR>
map <C-m> :cprevious<CR>
nnoremap <leader>a :cclose<CR>
autocmd FileType go nmap <leader>b  <Plug>(go-build)
autocmd FileType go nmap <leader>r  <Plug>(go-run)
let g:go_list_type = "quickfix"

" let g:autotagStartMethod='fork'




let g:go_fmt_command = "goimports" " 格式化将默认的 gofmt 替换
let g:go_autodetect_gopath = 1
let g:go_list_type = "quickfix"
let g:go_version_warning = 1
let g:go_highlight_types = 1
let g:go_highlight_fields = 1
let g:go_highlight_functions = 1
let g:go_highlight_function_calls = 1
let g:go_highlight_operators = 1
let g:go_highlight_extra_types = 1
let g:go_highlight_methods = 1
let g:go_highlight_generate_tags = 1
let g:godef_split=2



let g:UltiSnipsSnippetDirectories=['UltiSnips' , '~/.vim/bundle/vim-go/gosnippets/UltiSnips']
"let g:UltiSnipsSnippetsDir = '~/.vim/UltiSnips'
"let g:UltiSnipsExpandTrigger='<c-tab>'
"let g:UltiSnipsJumpForwardTrigger='<c-j>'
"let g:UltiSnipsJumpBackwardTrigger='<c-k>'

" ycm config
" let g:ycm_key_list_previous_completion=['<Up>']




let g:ycm_key_list_select_completion = ['<C-j>']
let g:ycm_key_list_previous_completion = ['<C-k>']

let g:UltiSnipsExpandTrigger = "<C-l>"
let g:UltiSnipsJumpForwardTrigger = "<C-j>"
let g:UltiSnipsJumpBackwardTrigger = "<C-k>"


autocmd BufNewFile,BufRead *.go setlocal noexpandtab tabstop=4 shiftwidth=4 


" tagbar config
nmap <F9> :TagbarToggle<CR>
let g:tagbar_width=25
let g:tagbar_type_go = {
    \ 'ctagstype' : 'go',
    \ 'kinds'     : [
        \ 'p:package',
        \ 'i:imports:1',
        \ 'c:constants',
        \ 'v:variables',
        \ 't:types',
        \ 'n:interfaces',
        \ 'w:fields',
        \ 'e:embedded',
        \ 'm:methods',
        \ 'r:constructor',
        \ 'f:functions'
    \ ],
    \ 'sro' : '.',
    \ 'kind2scope' : {
        \ 't' : 'ctype',
        \ 'n' : 'ntype'
    \ },
    \ 'scope2kind' : {
        \ 'ctype' : 't',
        \ 'ntype' : 'n'
    \ },
    \ 'ctagsbin'  : 'gotags',
    \ 'ctagsargs' : '-sort -silent'
\ }


```