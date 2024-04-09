"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[946],{2853:function(e,a,t){t.d(a,{f:function(){return Calendar}});var l=t(2322);t(2784);var s=t(6097),r=t(6839),n=t(2072),i=t(6229),d=t(9276);let Calendar=e=>{let{className:a,classNames:t,showOutsideDays:o=!0,...c}=e;return(0,l.jsx)(n._W,{showOutsideDays:o,className:(0,i.cn)("p-3 font-secondary",a),classNames:{months:"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",month:"space-y-4",caption:"flex justify-center pt-1 relative items-center",caption_label:"text-sm font-medium",nav:"space-x-1 flex items-center",nav_button:(0,i.cn)((0,d.d)({variant:"outline"}),"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),nav_button_previous:"absolute left-1",nav_button_next:"absolute right-1",table:"w-full border-collapse space-y-1",head_row:"flex",head_cell:"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",row:"flex w-full mt-2",cell:(0,i.cn)("relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary ","range"===c.mode?"[&:has(>.day-range-end)]:rounded-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md":"[&:has([aria-selected])]:rounded-md"),day:"h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",day_selected:"bg-secondary text-white",day_today:"border-[1px] border-black",day_outside:"text-muted-foreground opacity-50",day_disabled:"text-muted-foreground opacity-50",day_range_middle:"aria-selected:bg-primary aria-selected:text-accent-foreground",day_hidden:"invisible",...t},components:{IconLeft:()=>(0,l.jsx)(s.Z,{className:"h-4 w-4"}),IconRight:()=>(0,l.jsx)(r.Z,{className:"h-4 w-4"})},...c})};Calendar.displayName="Calendar"},3040:function(e,a,t){t.d(a,{J2:function(){return i},xo:function(){return d},yk:function(){return o}});var l=t(2322),s=t(2784),r=t(5366),n=t(6229);let i=r.fC,d=r.xz,o=(0,s.forwardRef)((e,a)=>{let{className:t,align:s="center",sideOffset:i=4,...d}=e;return(0,l.jsx)(r.h_,{children:(0,l.jsx)(r.VY,{ref:a,align:s,sideOffset:i,className:(0,n.cn)("z-50 w-72 rounded-md bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",t),...d})})});o.displayName=r.VY.displayName},2863:function(e,a,t){var l=t(2322),s=t(2784),r=t(929),n=t(6229);let i=(0,r.j)("flex h-14 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray/800 placeholder:text-sm focus-visible:text-secondary",{variants:{variant:{default:"bg-white",gray:"bg-gray/200"}},defaultVariants:{variant:"default"}}),d=(0,r.j)("absolute left-3 top-2 z-10 text-sm not-italic group-focus-within:text-secondary",{variants:{labelVariant:{default:"text-gray/600",black:"text-primary-foreground"}},defaultVariants:{labelVariant:"default"}}),o=(0,s.forwardRef)((e,a)=>{let{className:t,variant:s,labelVariant:r,type:o,icon:c,withLabelText:u,...m}=e;return(0,l.jsxs)("div",{className:"relative",children:[c&&(0,l.jsx)("div",{className:"pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",children:c}),(0,l.jsxs)("div",{className:"group",children:[u&&(0,l.jsx)("label",{className:(0,n.cn)(d({labelVariant:r})),children:u}),(0,l.jsx)("input",{type:o,className:(0,n.cn)(i({variant:s}),c&&"pl-10",u&&"h-[66px] pt-8",t),ref:a,...m})]})]})});o.displayName="TextInput",a.Z=o},9644:function(e,a,t){var l=t(2322);a.Z=e=>{let{button:a,filter:t}=e;return(0,l.jsxs)("div",{children:[t,a&&(0,l.jsx)("div",{className:"flex items-center justify-between px-4 py-4",children:a})]})}},1110:function(e,a,t){t.d(a,{w:function(){return DataTable}});var l=t(2322),s=t(2784),r=t(5632),n=t(5412),i=t(3705),d=t(8880),o=t(5120),c=t(2174),u=t(9276),m=t(8830),x=t(2863),f=t(6229),h=t(2428);let g=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("div",{className:"w-full",children:(0,l.jsxs)(h.x,{children:[(0,l.jsx)("table",{ref:a,className:(0,f.cn)("w-full caption-bottom text-sm",t),...s}),(0,l.jsx)(h.B,{orientation:"horizontal"})]})})});g.displayName="Table";let p=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("thead",{ref:a,className:(0,f.cn)("[&_tr]:border-b",t),...s})});p.displayName="TableHeader";let b=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("tbody",{ref:a,className:(0,f.cn)("[&_tr:last-child]:border-0",t),...s})});b.displayName="TableBody";let y=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("tfoot",{ref:a,className:(0,f.cn)("bg-primary font-medium text-primary-foreground",t),...s})});y.displayName="TableFooter";let j=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("tr",{ref:a,className:(0,f.cn)("hover:bg-muted/50 border-b transition-colors data-[state=selected]:bg-muted",t),...s})});j.displayName="TableRow";let v=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("th",{ref:a,className:(0,f.cn)("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",t),...s})});v.displayName="TableHead";let N=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("td",{ref:a,className:(0,f.cn)("p-4 align-middle [&:has([role=checkbox])]:pr-0",t),...s})});N.displayName="TableCell";let w=s.forwardRef((e,a)=>{let{className:t,...s}=e;return(0,l.jsx)("caption",{ref:a,className:(0,f.cn)("mt-4 text-sm text-muted-foreground",t),...s})});w.displayName="TableCaption";var S=t(6068),C=t(6642),_=t(6097),P=t(6839),T=t(7936),molecules_Pagination=e=>{let{pageSize:a,setPageSize:t,pageIndex:s,pageCount:n,goToPage:i,canPreviousPage:d,canNextPage:o,tableKey:m=""}=e,x=(0,c.useTranslations)(),f=(0,r.useRouter)(),{query:h}=f,updatePageQuery=async e=>{let a="?".concat((0,C.stringify)({...h,["".concat(m,"page")]:e}));await f.push(a,void 0,{shallow:!0})},updateSizeQuery=async e=>{let a="?".concat((0,C.stringify)({...h,["".concat(m,"size")]:e}));await f.push(a,void 0,{shallow:!0})};return(0,l.jsxs)("div",{className:"mt-4 flex w-full items-center justify-end pr-4",children:[(0,l.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,l.jsx)("p",{className:"mr-1 text-sm",children:x("dataTable.rowsPerPage")}),(0,l.jsxs)(T.Ph,{value:"".concat(a),onValueChange:async e=>{t(Number(e)),await updateSizeQuery(Number(e))},children:[(0,l.jsx)(T.i4,{className:"h-8 w-[70px]",children:(0,l.jsx)(T.ki,{placeholder:a})}),(0,l.jsx)(T.Bw,{side:"top",children:[5,10,20,30,40,50].map(e=>(0,l.jsx)(T.Ql,{value:"".concat(e),children:e},e))})]})]}),(0,l.jsx)("div",{className:"flex w-[100px] items-center justify-center text-sm",children:x("dataTable.pageCounter",{actualPage:(s+1).toString(),totalPages:n.toString()})}),(0,l.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,l.jsxs)(u.z,{className:"h-8 w-8 p-0",onClick:async()=>{i(s-1),await updatePageQuery(s-1)},disabled:!d,children:[(0,l.jsx)("span",{className:"sr-only",children:x("dataTable.goToPreviousPage")}),(0,l.jsx)(_.Z,{className:"h-4 w-4"})]}),(0,l.jsxs)(u.z,{className:"h-8 w-8 p-0",onClick:async()=>{i(s+1),await updatePageQuery(s+1)},disabled:!o,children:[(0,l.jsx)("span",{className:"sr-only",children:x("dataTable.goToNextPage")}),(0,l.jsx)(P.Z,{className:"h-4 w-4"})]})]})]})};let TableShimmer=e=>{let{columns:a}=e;return(0,l.jsx)(j,{children:(0,l.jsx)(N,{colSpan:a,children:(0,l.jsx)(S.O,{className:"h-[22px] w-full"})})})},DataTable=e=>{var a,t,f,h;let{columns:y,data:w,customHeader:S,enablePagination:C=!0,manualPagination:_,tableKey:P="",isLoading:T}=e,z=(0,c.useTranslations)(),R=(0,r.useRouter)(),k=R.query["".concat(P,"page")],Z=R.query["".concat(P,"size")],[F,I]=s.useState([]),[V,D]=s.useState({}),[L,M]=s.useState(""),[E,Q]=s.useState([]),[B,G]=s.useState({}),{getRowModel:H,getCanNextPage:O,getCanPreviousPage:W,getPageCount:q,setPageSize:A,setPageIndex:J,...Y}=(0,n.b7)({data:w,columns:y,enableGlobalFilter:!0,globalFilterFn:"includesString",manualPagination:!!_,getCoreRowModel:(0,i.sC)(),getPaginationRowModel:C&&!_?(0,i.G_)():void 0,onSortingChange:I,getSortedRowModel:(0,i.tj)(),onColumnFiltersChange:Q,getFilteredRowModel:(0,i.vL)(),onColumnVisibilityChange:G,onRowSelectionChange:D,onGlobalFilterChange:M,manualSorting:!0,state:{sorting:F,columnFilters:E,columnVisibility:B,rowSelection:V,globalFilter:L,pagination:{pageSize:Z?Number(Z):10,pageIndex:k?Number(k):0}}}),{pagination:{pageIndex:K,pageSize:U}}=Y.getState(),$=H().rows,X=52*(C?Z?Number(Z)+1:_?_.pageSize+1:U+1:$?$.length+1:0);return(0,s.useEffect)(()=>{_&&(k&&_.setPageIndex(Number(k)),Z&&_.setPageSize(Number(Z)))},[k,Z,_]),(0,l.jsxs)("div",{className:"border-black_5 rounded-xxl bg-white px-4 py-6",children:[null!=S?S:(0,l.jsxs)("div",{className:"mb-4 flex w-full items-center gap-4",children:[(0,l.jsx)("div",{className:"text-black_40 w-full",children:(0,l.jsx)(x.Z,{placeholder:z("dataTable.searchPlaceholder"),value:null!=L?L:"",onChange:e=>{M(e.target.value)},className:"border-light_grey h-10 w-full border border-gray/300 placeholder:text-xs",type:"text",icon:(0,l.jsx)(d.Z,{size:18})})}),(0,l.jsxs)(m.h_,{children:[(0,l.jsx)(m.$F,{asChild:!0,children:(0,l.jsx)(u.z,{variant:"outline",className:"ml-auto",children:(0,l.jsxs)("div",{className:"flex items-center gap-2 text-xs font-normal",children:[(0,l.jsx)(o.Z,{size:18}),z("dataTable.view")]})})}),(0,l.jsx)(m.AW,{align:"end",children:Y.getAllColumns().filter(e=>e.getCanHide()).map(e=>(0,l.jsx)(m.bO,{className:"capitalize",checked:e.getIsVisible(),onCheckedChange:a=>e.toggleVisibility(!!a),children:e.id},e.id))})]})]}),(0,l.jsx)("div",{style:{minHeight:"".concat(X,"px")},children:(0,l.jsxs)(g,{className:"text-xs",children:[(0,l.jsx)(p,{className:"border-none bg-gray/100",children:Y.getHeaderGroups().map(e=>(0,l.jsx)(j,{className:"border-none",children:e.headers.map(e=>(0,l.jsx)(v,{className:"text-gray/700",children:e.isPlaceholder?null:(0,n.ie)(e.column.columnDef.header,e.getContext())},e.id))},e.id))}),(0,l.jsx)(b,{children:T?Array.from({length:null!==(t=null==_?void 0:_.pageSize)&&void 0!==t?t:U}).map((e,a)=>(0,l.jsx)(TableShimmer,{columns:y.length},a)):(null===(a=H().rows)||void 0===a?void 0:a.length)?H().rows.map(e=>(0,l.jsx)(j,{"data-state":e.getIsSelected()&&"selected",className:"border-black_20 text-dark_grey border-dashed",children:e.getVisibleCells().map(e=>(0,l.jsx)(N,{children:(0,n.ie)(e.column.columnDef.cell,e.getContext())},e.id))},e.id)):(0,l.jsx)(j,{children:(0,l.jsx)(N,{colSpan:y.length,className:"h-24 text-center",children:z("dataTable.noResults")})})})]})}),C&&(0,l.jsx)(molecules_Pagination,{pageSize:null!==(f=null==_?void 0:_.pageSize)&&void 0!==f?f:U,setPageSize:e=>_?_.setPageSize(e):A(e),goToPage:_?_.setPageIndex:J,canPreviousPage:_?_.pageIndex>0:W(),canNextPage:_?(_.pageIndex+1)*_.pageSize<_.total:O(),pageCount:_?Math.ceil(_.total/_.pageSize):q(),pageIndex:null!==(h=null==_?void 0:_.pageIndex)&&void 0!==h?h:K,tableKey:P})]})}},8147:function(e,a,t){t.d(a,{Z:function(){return TableFilterBar}});var l=t(2322),s=t(8880),r=t(2174),n=t(2863),i=t(2784),d=t(7755),o=t(6026),c=t(9276),u=t(2853),m=t(3040),x=t(6229);let DatePickerWithRange=e=>{let{className:a,setDate:t}=e,[s,n]=i.useState(void 0),f=(0,r.useTranslations)();return(0,l.jsx)("div",{className:(0,x.cn)("grid gap-2",a),children:(0,l.jsxs)(m.J2,{children:[(0,l.jsx)(m.xo,{asChild:!0,children:(0,l.jsxs)(c.z,{id:"date",variant:"outline",className:(0,x.cn)("h-full justify-start text-left font-normal",!s&&"text-gray/600"),children:[(0,l.jsx)(o.Z,{className:"mr-2 h-4 w-4"}),(null==s?void 0:s.from)?s.to?(0,l.jsxs)(l.Fragment,{children:[(0,d.Z)(s.from,"dd/LL/yyyy")," - ",(0,d.Z)(s.to,"dd/LL/yyyy")]}):(0,d.Z)(s.from,"dd/LL/yyyy"):(0,l.jsx)("span",{children:f("analyze.initiativeManagement.pickDateRange")})]})}),(0,l.jsx)(m.yk,{className:"w-auto p-0",align:"start",onInteractOutside:()=>t(s),children:(0,l.jsx)(u.f,{initialFocus:!0,mode:"range",defaultMonth:null==s?void 0:s.from,selected:s,onSelect:n})})]})})};var TableFilterBar=e=>{let{queryFilter:a,dateFilter:t,searchPlaceholder:i}=e,d=(0,r.useTranslations)();return(0,l.jsxs)("div",{className:"flex w-full flex-col gap-4 rounded-2xl rounded-b-none md:flex-row",children:[a&&(0,l.jsx)("div",{className:"w-full",children:(0,l.jsx)(n.Z,{placeholder:null!=i?i:d("filter.search"),className:"h-10 border border-gray_24 placeholder:text-cancel",type:"text",onChange:e=>a.setFilter(e.target.value),icon:(0,l.jsx)(s.Z,{size:12,className:"text-cancel"}),defaultValue:a.filter})}),t&&(0,l.jsx)(DatePickerWithRange,{className:"h-10 min-w-[276px]",setDate:t.setFilter})]})}},6531:function(e,a,t){var l=t(2784);a.Z=(e,a)=>{let[t,s]=(0,l.useState)(e);return(0,l.useEffect)(()=>{let t=setTimeout(()=>{s(e)},a);return()=>{clearTimeout(t)}},[e,a]),t}},4363:function(e,a,t){t.d(a,{G:function(){return usePersistFilters}});var l=t(2784),s=t(5632);let usePersistFilters=e=>{let a=(0,s.useRouter)(),t=new URLSearchParams({});e.forEach(e=>{let{name:a,value:l}=e;l.length>0&&t.append(a,l)});let r=t.toString();(0,l.useEffect)(()=>{a.push({pathname:a.asPath.split("?")[0],query:r})},[r])}}}]);