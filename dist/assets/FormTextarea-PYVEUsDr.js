import{r as f,j as s}from"./index-DOQ3mfqC.js";const g=f.forwardRef(({label:r,id:i,name:c,placeholder:d,error:a,helperText:e,className:n="",containerClassName:l="",labelClassName:m="",required:o=!1,rows:x=4,...u},b)=>{const t=i||c;return s.jsxs("div",{className:`mb-4 ${l}`,children:[r&&s.jsxs("label",{htmlFor:t,className:`block text-sm font-medium text-gray-700 mb-1.5 ${m}`,children:[r," ",o&&s.jsx("span",{className:"text-accent-500",children:"*"})]}),s.jsx("textarea",{ref:b,id:t,name:c,placeholder:d,rows:x,className:`
          w-full px-4 py-2.5 border rounded-lg 
          ${a?"border-accent-300 bg-accent-50 focus:ring-accent-500 focus:border-accent-500":"border-gray-200 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-opacity-30
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors duration-200
          ${n}
        `,"aria-invalid":a?"true":"false","aria-describedby":e||a?`${t}-description`:void 0,required:o,...u}),(a||e)&&s.jsx("div",{id:`${t}-description`,className:`mt-1.5 text-sm ${a?"text-accent-600":"text-gray-500"}`,children:a||e})]})});g.displayName="FormTextarea";export{g as F};
