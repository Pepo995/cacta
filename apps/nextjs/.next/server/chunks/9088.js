"use strict";exports.id=9088,exports.ids=[9088],exports.modules={2244:(e,a,s)=>{s.a(e,async(e,t)=>{try{s.d(a,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var l=s(997),r=s(9819);s(6689);var i=s(5632),n=s(6097),d=s(6839),o=s(503),c=s(9276),x=s(7936),m=e([c,x]);[c,x]=m.then?(await m)():m;let __WEBPACK_DEFAULT_EXPORT__=({pageSize:e,setPageSize:a,pageIndex:s,pageCount:t,goToPage:m,canPreviousPage:h,canNextPage:g,tableKey:u=""})=>{let p=(0,o.useTranslations)(),b=(0,i.useRouter)(),{query:f}=b,updatePageQuery=async e=>{let a=`?${(0,r.stringify)({...f,[`${u}page`]:e})}`;await b.push(a,void 0,{shallow:!0})},updateSizeQuery=async e=>{let a=`?${(0,r.stringify)({...f,[`${u}size`]:e})}`;await b.push(a,void 0,{shallow:!0})};return(0,l.jsxs)("div",{className:"mt-4 flex w-full items-center justify-end pr-4",children:[(0,l.jsxs)("div",{className:"flex items-center space-x-2",children:[l.jsx("p",{className:"mr-1 text-sm",children:p("dataTable.rowsPerPage")}),(0,l.jsxs)(x.Ph,{value:`${e}`,onValueChange:async e=>{a(Number(e)),await updateSizeQuery(Number(e))},children:[l.jsx(x.i4,{className:"h-8 w-[70px]",children:l.jsx(x.ki,{placeholder:e})}),l.jsx(x.Bw,{side:"top",children:[5,10,20,30,40,50].map(e=>l.jsx(x.Ql,{value:`${e}`,children:e},e))})]})]}),l.jsx("div",{className:"flex w-[100px] items-center justify-center text-sm",children:p("dataTable.pageCounter",{actualPage:(s+1).toString(),totalPages:t.toString()})}),(0,l.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,l.jsxs)(c.z,{className:"h-8 w-8 p-0",onClick:async()=>{m(s-1),await updatePageQuery(s-1)},disabled:!h,children:[l.jsx("span",{className:"sr-only",children:p("dataTable.goToPreviousPage")}),l.jsx(n.Z,{className:"h-4 w-4"})]}),(0,l.jsxs)(c.z,{className:"h-8 w-8 p-0",onClick:async()=>{m(s+1),await updatePageQuery(s+1)},disabled:!g,children:[l.jsx("span",{className:"sr-only",children:p("dataTable.goToNextPage")}),l.jsx(d.Z,{className:"h-4 w-4"})]})]})]})};t()}catch(e){t(e)}})},5084:(e,a,s)=>{s.a(e,async(e,t)=>{try{s.d(a,{RM:()=>x,SC:()=>h,iA:()=>o,pj:()=>u,ss:()=>g,xD:()=>c});var l=s(997),r=s(6689),i=s(8293),n=s(2428),d=e([i,n]);[i,n]=d.then?(await d)():d;let o=r.forwardRef(({className:e,...a},s)=>l.jsx("div",{className:"w-full",children:(0,l.jsxs)(n.x,{children:[l.jsx("table",{ref:s,className:(0,i.cn)("w-full caption-bottom text-sm",e),...a}),l.jsx(n.B,{orientation:"horizontal"})]})}));o.displayName="Table";let c=r.forwardRef(({className:e,...a},s)=>l.jsx("thead",{ref:s,className:(0,i.cn)("[&_tr]:border-b",e),...a}));c.displayName="TableHeader";let x=r.forwardRef(({className:e,...a},s)=>l.jsx("tbody",{ref:s,className:(0,i.cn)("[&_tr:last-child]:border-0",e),...a}));x.displayName="TableBody";let m=r.forwardRef(({className:e,...a},s)=>l.jsx("tfoot",{ref:s,className:(0,i.cn)("bg-primary font-medium text-primary-foreground",e),...a}));m.displayName="TableFooter";let h=r.forwardRef(({className:e,...a},s)=>l.jsx("tr",{ref:s,className:(0,i.cn)("hover:bg-muted/50 border-b transition-colors data-[state=selected]:bg-muted",e),...a}));h.displayName="TableRow";let g=r.forwardRef(({className:e,...a},s)=>l.jsx("th",{ref:s,className:(0,i.cn)("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",e),...a}));g.displayName="TableHead";let u=r.forwardRef(({className:e,...a},s)=>l.jsx("td",{ref:s,className:(0,i.cn)("p-4 align-middle [&:has([role=checkbox])]:pr-0",e),...a}));u.displayName="TableCell";let p=r.forwardRef(({className:e,...a},s)=>l.jsx("caption",{ref:s,className:(0,i.cn)("mt-4 text-sm text-muted-foreground",e),...a}));p.displayName="TableCaption",t()}catch(e){t(e)}})},9644:(e,a,s)=>{s.d(a,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var t=s(997);let __WEBPACK_DEFAULT_EXPORT__=({button:e,filter:a})=>(0,t.jsxs)("div",{children:[a,e&&t.jsx("div",{className:"flex items-center justify-between px-4 py-4",children:e})]})},4032:(e,a,s)=>{s.a(e,async(e,t)=>{try{s.d(a,{w:()=>DataTable});var l=s(997),r=s(6689),i=s.n(r),n=s(5632),d=s(6869),o=s(8880),c=s(5120),x=s(503),m=s(9276),h=s(8830),g=s(2863),u=s(5084),p=s(6068),b=s(2244),f=e([d,m,h,g,u,p,b]);[d,m,h,g,u,p,b]=f.then?(await f)():f;let TableShimmer=({columns:e})=>l.jsx(u.SC,{children:l.jsx(u.pj,{colSpan:e,children:l.jsx(p.O,{className:"h-[22px] w-full"})})}),DataTable=({columns:e,data:a,customHeader:s,enablePagination:t=!0,manualPagination:p,tableKey:f="",isLoading:j})=>{let N=(0,x.useTranslations)(),w=(0,n.useRouter)(),y=w.query[`${f}page`],_=w.query[`${f}size`],[P,S]=i().useState([]),[T,C]=i().useState({}),[R,v]=i().useState(""),[E,z]=i().useState([]),[A,F]=i().useState({}),{getRowModel:D,getCanNextPage:k,getCanPreviousPage:M,getPageCount:$,setPageSize:B,setPageIndex:I,...Z}=(0,d.useReactTable)({data:a,columns:e,enableGlobalFilter:!0,globalFilterFn:"includesString",manualPagination:!!p,getCoreRowModel:(0,d.getCoreRowModel)(),getPaginationRowModel:t&&!p?(0,d.getPaginationRowModel)():void 0,onSortingChange:S,getSortedRowModel:(0,d.getSortedRowModel)(),onColumnFiltersChange:z,getFilteredRowModel:(0,d.getFilteredRowModel)(),onColumnVisibilityChange:F,onRowSelectionChange:C,onGlobalFilterChange:v,manualSorting:!0,state:{sorting:P,columnFilters:E,columnVisibility:A,rowSelection:T,globalFilter:R,pagination:{pageSize:_?Number(_):10,pageIndex:y?Number(y):0}}}),{pagination:{pageIndex:O,pageSize:K}}=Z.getState(),L=D().rows,U=52*(t?_?Number(_)+1:p?p.pageSize+1:K+1:L?L.length+1:0);return(0,r.useEffect)(()=>{p&&(y&&p.setPageIndex(Number(y)),_&&p.setPageSize(Number(_)))},[y,_,p]),(0,l.jsxs)("div",{className:"border-black_5 rounded-xxl bg-white px-4 py-6",children:[s??(0,l.jsxs)("div",{className:"mb-4 flex w-full items-center gap-4",children:[l.jsx("div",{className:"text-black_40 w-full",children:l.jsx(g.Z,{placeholder:N("dataTable.searchPlaceholder"),value:R??"",onChange:e=>{v(e.target.value)},className:"border-light_grey h-10 w-full border border-gray/300 placeholder:text-xs",type:"text",icon:l.jsx(o.Z,{size:18})})}),(0,l.jsxs)(h.h_,{children:[l.jsx(h.$F,{asChild:!0,children:l.jsx(m.z,{variant:"outline",className:"ml-auto",children:(0,l.jsxs)("div",{className:"flex items-center gap-2 text-xs font-normal",children:[l.jsx(c.Z,{size:18}),N("dataTable.view")]})})}),l.jsx(h.AW,{align:"end",children:Z.getAllColumns().filter(e=>e.getCanHide()).map(e=>l.jsx(h.bO,{className:"capitalize",checked:e.getIsVisible(),onCheckedChange:a=>e.toggleVisibility(!!a),children:e.id},e.id))})]})]}),l.jsx("div",{style:{minHeight:`${U}px`},children:(0,l.jsxs)(u.iA,{className:"text-xs",children:[l.jsx(u.xD,{className:"border-none bg-gray/100",children:Z.getHeaderGroups().map(e=>l.jsx(u.SC,{className:"border-none",children:e.headers.map(e=>l.jsx(u.ss,{className:"text-gray/700",children:e.isPlaceholder?null:(0,d.flexRender)(e.column.columnDef.header,e.getContext())},e.id))},e.id))}),l.jsx(u.RM,{children:j?Array.from({length:p?.pageSize??K}).map((a,s)=>l.jsx(TableShimmer,{columns:e.length},s)):D().rows?.length?D().rows.map(e=>l.jsx(u.SC,{"data-state":e.getIsSelected()&&"selected",className:"border-black_20 text-dark_grey border-dashed",children:e.getVisibleCells().map(e=>l.jsx(u.pj,{children:(0,d.flexRender)(e.column.columnDef.cell,e.getContext())},e.id))},e.id)):l.jsx(u.SC,{children:l.jsx(u.pj,{colSpan:e.length,className:"h-24 text-center",children:N("dataTable.noResults")})})})]})}),t&&l.jsx(b.Z,{pageSize:p?.pageSize??K,setPageSize:e=>p?p.setPageSize(e):B(e),goToPage:p?p.setPageIndex:I,canPreviousPage:p?p.pageIndex>0:M(),canNextPage:p?(p.pageIndex+1)*p.pageSize<p.total:k(),pageCount:p?Math.ceil(p.total/p.pageSize):$(),pageIndex:p?.pageIndex??O,tableKey:f})]})};t()}catch(e){t(e)}})},6531:(e,a,s)=>{s.d(a,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var t=s(6689);let __WEBPACK_DEFAULT_EXPORT__=(e,a)=>{let[s,l]=(0,t.useState)(e);return(0,t.useEffect)(()=>{let s=setTimeout(()=>{l(e)},a);return()=>{clearTimeout(s)}},[e,a]),s}},4363:(e,a,s)=>{s.d(a,{G:()=>usePersistFilters});var t=s(6689),l=s(5632);let usePersistFilters=e=>{let a=(0,l.useRouter)(),s=new URLSearchParams({});e.forEach(({name:e,value:a})=>{a.length>0&&s.append(e,a)});let r=s.toString();(0,t.useEffect)(()=>{a.push({pathname:a.asPath.split("?")[0],query:r})},[r])}}};