"use strict";exports.id=4429,exports.ids=[4429],exports.modules={4429:(s,a,e)=>{e.a(s,async(s,l)=>{try{e.d(a,{U:()=>InformationModal});var c=e(997);e(6689);var x=e(6926),i=e(428),r=e(1267),d=e(2428),m=e(8590),n=e(6068),t=s([x,i,r,d,m,n]);[x,i,r,d,m,n]=t.then?(await t)():t;let h=(0,x.cva)("flex flex-col",{variants:{size:{big:"w-[calc(100%_-_300px)]",small:"lg:w-[calc(100%_-_650px)] w-[calc(100%_-_200px)]",xsmall:"w-[calc(100%_-_200px)] max-w-[495px]"}},defaultVariants:{size:"small"}}),HeaderShimmer=()=>c.jsx(i.fK,{className:"mb-5",children:c.jsx(i.$N,{className:"font-medium text-secondary",children:c.jsx(n.O,{className:"h-[40px] min-w-[150px] max-w-[275px]"})})}),InformationModal=({triggerButton:s,title:a,description:e,children:l,withCloseButton:x=!0,size:n,open:t,setOpen:o,loading:p})=>(0,c.jsxs)(i.Vq,{open:t,onOpenChange:o,children:[c.jsx(i.hg,{asChild:!0,children:s}),(0,c.jsxs)(i.cZ,{withCloseButton:x,className:h({size:n}),children:[p?c.jsx(HeaderShimmer,{}):(0,c.jsxs)(i.fK,{className:"mb-5 px-4",children:[c.jsx(i.$N,{className:"font-medium text-secondary",children:c.jsx(r.Z,{className:"leading-6",children:a})}),e&&c.jsx(i.Be,{className:"text-xs",children:e})]}),c.jsx(m.Z,{className:"border-dashed border-gray/300"}),c.jsx(d.x,{children:c.jsx("div",{className:"h-fit max-h-[60vh] min-h-[100px] p-4",children:l})})]})]});l()}catch(s){l(s)}})}};