(this.webpackJsonpnatify=this.webpackJsonpnatify||[]).push([[0],{134:function(e,t,n){var r,a=n(453).wrap,i=n(438);e.exports=function e(){return this instanceof e?a(i()):r||(r=a(i()))}},139:function(e,t,n){},140:function(e,t,n){},438:function(e,t,n){e.exports=function(){return new Worker(n.p+"39d42b2a856dabf7b5b4.worker.js")}},452:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),i=n(35),o=n.n(i),c=(n(139),n.p,n(140),n(29)),u=n(10),s=n.n(u),l=n(36),d=n(17),f=n(5),h=n(4),p=(n(141),n(3));function b(e,t,n,r){return{x:e+n*Math.cos(r),y:t+n*Math.sin(r)}}function v(e,t,n,r,a){var i=b(e,t,n,a),o=b(e,t,n,r),c=a-r<=Math.PI?"0":"1";return["M",i.x,i.y,"A",n,n,0,c,0,o.x,o.y].join(" ")}var x=120;function j(e){var t=e.angle,n=Object(r.useMemo)((function(){var e=t+Math.PI/2,n=[v(90,90,70,Math.PI/2,e)];return e>=2.5*Math.PI&&(n=[v(90,90,70,Math.PI/2,1.99*Math.PI+Math.PI/2),v(90,90,70,Math.PI/2,e%(2*Math.PI))]),{arcpaths:n,cx:90+70*Math.cos(e),cy:90+70*Math.sin(e)}}),[t]);return Object(p.jsxs)("svg",{width:x,height:x,viewBox:"0 0 180 180",style:{padding:5,boxSizing:"border-box"},children:[Object(p.jsx)("defs",{children:Object(p.jsxs)("linearGradient",{id:"prefix__svgya",x1:0,x2:0,y1:0,y2:1,children:[Object(p.jsx)("stop",{offset:"0%",stopColor:"rgb(96, 197, 177)"}),Object(p.jsx)("stop",{offset:"100%",stopColor:"rgb(100, 153, 211)"})]})}),Object(p.jsx)("circle",{r:70,cx:90,cy:90,strokeWidth:5,stroke:"#333",fill:"none"}),n.arcpaths.map((function(e,t){return Object(p.jsx)("path",{d:e,strokeLinecap:"round",strokeWidth:20,stroke:"url(#prefix__svgya)",fill:"none"})})),Object(p.jsx)("circle",{r:20,cx:n.cx,cy:n.cy,fill:"#fff",cursor:"pointer"})]})}function g(e,t){return Math.round(e)!==e?Math.round(t*(1/e))/(1/e)+"":Math.round(t)+""}function m(e){var t=e.min,n=e.max,a=e.step,i=e.value,o=e.onChange,c=(e.maxTurn,e.name),u=e.unit,s=Object(r.useMemo)((function(){return 2*Math.PI*(i-t)/(n-t)})),l=Object(r.useRef)(),d=Object(r.useCallback)((function(e){var r=l.current.getBoundingClientRect(),i=r.width/2,c=e.clientX-r.left,u=e.clientY-r.top,s=Math.atan2(u-i,c-i);if(s=(s+2*Math.PI-Math.PI/2)%(2*Math.PI),s/=2*Math.PI,!isNaN(s)){var d=t+(n-t)*s;d=Math.max(t,Math.min(n,Math.round(d/a)*a)),o(d)}}),[o,t,n,a]),f=Object(r.useState)(!1),b=Object(h.a)(f,2),v=b[0],x=b[1],m=Object(r.useState)(!1),O=Object(h.a)(m,2),w=O[0],y=O[1];return Object(r.useEffect)((function(){window.addEventListener("mouseup",(function(){return x(!1)}))}),[]),Object(r.useEffect)((function(){if(v)return window.addEventListener("mousemove",d),function(){return window.removeEventListener("mousemove",d)}}),[v,d]),Object(p.jsxs)("div",{ref:l,style:{userSelect:"none",width:"120px",height:"120px",position:"relative",backgroundColor:v||w?"rgba(200,255,255,0.03)":"rgba(0,0,0,0)",boxShadow:v?"rgba(0,0,0,0.3) 0px 0px 14px":"none",transition:"background-color 0ms, box-shadow 200ms ",borderRadius:"5px"},onMouseEnter:function(){return y(!0)},onMouseLeave:function(){return y(!1)},onMouseDown:function(e){x(!0),d(e)},children:[Object(p.jsx)(j,{angle:s}),Object(p.jsxs)("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"},children:[Object(p.jsx)("div",{style:{fontSize:"0.7em",fontWeight:"bold",color:"grey"},children:c}),Object(p.jsx)("div",{style:{color:"rgb(100, 153, 211)"},children:g(a,i)+" "+u})]})]})}n(434),n(435);var O=n(83),w=n(134),y=n.n(w),F=n(132);function B(e){var t=e.name,n=e.value,r=e.onChange;return Object(p.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[Object(p.jsx)("div",{style:{textAlign:"left",color:"grey",fontSize:"0.7em",fontWeight:"bold"},children:t}),n.map((function(e,t){return Object(p.jsx)("div",{style:{display:"flex",flexDirection:"row",width:20*e.length+"px",height:"20px"},children:e.map((function(e,a){return Object(p.jsx)("div",{style:{width:"20px",height:"20px",backgroundColor:e?"rgb(100, 153, 211)":"#465",borderRadius:"3px"},onClick:function(){var e=F(n);e[t][a]=!e[t][a],r(e)}})}))})}))]})}n(439),n(441);var C=n(442),M=n(132);var k=new y.a,V="?data=eJxtkm9v2jAQxr%2FKya8KzRJnK5qUri%2FQykaltWX982IiaDLJAV4dG8U2FBDffWdCqKrtVc7ne36%2B5y47VpgSWcaSJLmWc%2BmEAmu8LkFa%2BOOtAwEWHZgZWFEtFdoY%2BscQalzWaFE7e9SEo%2FU1ggi6uVyhBicrjHNN%2FCHSzcZ4KISGEmdS4z90cAvSrqVSMEVYKrHBEqaieAFngjbXBxR8V2YqlAVByAyunx%2F6Tzf3dxHQdwBnFxcp54ttHHcieOzfjn4Mfn%2B9f757atW%2F3jdRkE9TgVWyxBqmG%2FBW6jkUpqoO5pR8QWqMJmKoOgsMbxG%2BPQx%2BQo%2BHzug5HoQpDLeX4RVFrlpLVzCe5Hpmajh7S1OWX7bxl3ddtunz8w7scg2QJGGIIDUNqzC6tCEZUIf01bE8Cd6b8scGW4X90Rin6NZIq%2FiQgqAtpaHo2Ny4%2BU6IcivcIibjZwdf3QbebdKjG%2Bh%2BjHmnwY%2F8yUWhjKWZ0QgOc1BmHU4LhJVRvsL%2FvNQl4%2FHnXO9zXaPztW4LWMSWohaVZdl4x7Sowm%2FZbpYuK6lZxuMeReKVZSmPmHW4DLk0YiuhPAko8lo6Ulq2j06YYKlF9PiJwE%2BMN91wy060T5zvJ%2Fu%2FqeoC8g%3D%3D",W="?data=eJydk1tv2jAUgP%2FKkZ9yI3EYaFJaNkU0E2gt7bg8TARVhpoRLXEQcVpWxH%2Bf7VzItGyd9gCxzznflxPn5IQ26RNFHnIcZ8f5PvMchzL7Jfoe7elTROz08M2ROydgzzRO9%2FRRS%2FIs2ughC5nj5BmFT9PgC%2FQx8BRcjDGsf4ALo9erKu%2FP5%2F7wM2Abu7IG264sUdusLroJhv7XN2pmi9ncH0%2FqqraaaXAb%2BLOgYer%2BUiXr7gjfwYjGe3qAbc42PEpZFrKYctjEJNnDALSjBcSCtQ6DDyDr7YQcNREp1hHT1hYcdb2gtjHhGacKlJRMSVDZNO0IHSA6OKCt1coCbIFbspSIrgXHFcHhGuw%2BfIQuGGIjfx50XDBB6wlWRXX5V8BZkqZ813ZrqdWqvuqMemsKFI3FNBPUchWybXoA7RIWUXxVra9h5t893AaPw%2FvFZF6FTVOHU8gAJMWjRDJFxpn680Bmylssi%2BtKFKizy8TZqYkxCs4owg9jMLo2Vg0COPW4QZvKGDSeXMNWMWGWEup%2FAFwbd8QwGA2wxIqLqSbw747f2AIyy8E0y%2BGzoC1bq1vkwo3t9yE7h%2BxAeX5gVQGy0J4cSJIhb3lCjCTyW71ZiDMe309EUkwi8rDdFytyRJ6LLSTbkzHXQs8kzgUgVjmLuCAzdLZqjXwLlaKPawOuHRdu9IpqW6%2BHG5LiSS%2BdYLcUqQaqXnCzhdok4u8aKnVa%2F23qNUzlibe4%2FsHUFJUvtLWp7tsq1z2vzj8BM4CUgw%3D%3D",S="?data=eJx9Vf1v2kgQ%2FVdGlk5aF2PWBkohTStEiRq1SXr5uF8SVC2wYOuM7drrhDTif7%2BZXX%2BFy12kYO%2Fsmzdv386uX6xVspbWxOr1ilzCX1ff7y7mAMBdzkEl4LkcYPmMY%2B%2FkITag6e030H8I8giEz6EBcQzkNfDL%2FGZWAj0goO9CyfYKd3Y9%2F1PjhlhMV%2F2A1RHncQh%2B17Cv0%2BuLq8vzGYoysFFJ57k15vxyVmvTmMGrBRDsQqgAvsoolRlsinilwiTOH%2BJIKlhFYpfCKbC9A8KBpQ2nn4Dw7k7sGUbMexizpQN72zZZm0ioXEmdSFk0RYmajbE9dEHY0AO21G8OcAe8MlcKFI15Smco%2BAjuED6DD%2B9wQP8T6HrQATbAXB216cck57skUcFbpYmWVbrqmbLmLtw3%2BJ3GCyRltNddCnRgieOdNvUmKeI13DzHKpB5mB87lhaZ1r%2FJ5C8HVGNYjiZRsFwISdfxH%2BelCpWFIt5Gb2eLZc5Yk9%2FF7fOHNvxB%2FUgG%2BFrq8aB05Vch%2Fi2qKtcEP%2Bke%2BaxbnFyu88XTcXKjpKVA1zQpQv1NKesK32wMw73WYQNcy1VjfWu9cp%2Bybr%2FyiJoN89RR45QcT0GoZJyEpnEajkzE62THjhypdjDNkpXMcVe2x1uYyUeZLYlrWWw2MnMgEltNa8buJsnmYhUwJh0IHZKEcyH6hzj0T9yHC%2Bic0hOLYmyBCrg7QFN5KTkPd2kkz85umyqa5OUhBqyviiyGWD7BZqPcWULY%2FTTLxHOJdSMZb1VgozF4nh5FVBglcUMCoMNuJkWERUweCjuhyYPtYm2GYg7VFlONHIGmzM304sf3%2Bc%2FZ1d3lLaJwwcAqHIL4iXn7CG2gCXY6tlGgexrBGtmD6%2Bnt%2FKSKUyVsNj3W5I8iQwc1c4i01c2Go5rPZOrGOzU3ZNkdafLE8JpDB%2BwGlwcipX6g81i3bjNN6w1VsSZITcLdYUOS6y2sYe8Mo3aPfkrH7um5oF3MEYJtz%2FBj4JhLCXvbjOjaL2Pme2KM7%2FVMp7GSy6FDzRFEVlVX6Ub9JA%2BrfqmwtPXbWEtjtptH4UrSCWlvB3ruI0vZTS8t0Q69bzORBvkE7qsglVqgMMuxUpGJXW5N7l%2BsWOzoa%2FjlDkWdX13iJN721oSssvBYWhOPOxYdbIp5jqW7DqOOVaA8zMytg1PTmOXXJBXFK4Yyz6q5sFaLAh1tRHCvpKAvbsPCebt%2Bi4j7fv89fz8aj0aD8Xj0YTxqMdM2NdQVs9%2Bi%2FQ%2FWwWDke%2F3heIic4%2BFo3OKkPq04h%2FV68WtesZJ9JWfwuyHtc95iqY5DxVRpG9Usb9jWbxHg8Tg2ffD%2FpvuHxeEf4%2FOUOQ%3D%3D",E="?data=eJx9VWlP20AQ%2FSsjS5XWxDFrE2MSLkU0FVG5ytEvgKpNYojV%2BMBeQwDlv3dm1xcpbSTw7ux7b2bfjtfvxjSZBcbA2Nws8gB%2Bnp%2FcnI4AgNucg0zAsTnA5BXnzu5drEHD6%2B%2BgfghyCIRPT4M4BvIa%2BHV0dVQCHSCga0Op9gH37XL0Q%2BE8TKay7mB2xDkc5m817Hh4eXp%2BNj7CojTML%2BUcu8aMz47q2hSm92EDBDsVcg7HwSINMngo4qkMkzi%2FixeBhOlCRCnsA1taICyYmLB%2FAIS3I7FkGNHjMGYTC5amqVkPCyFzGSgisWiJiEqNsSV0QZiwCWyiRhZwC5ySGwgsGnlSMSTsge3BIbiwgRP6G0DXgQ6wHnJV1KR%2FmpxHSSLnn6UmWVbVVa%2BUOaNw2eAjhRcoyuisuxTowATnkTL1KiniGVy9xnIe5GG%2B7lhaZKr%2Bhyx4skA2huVoEgXLjVDpKn4xLquQWSjix8XnbDHJGWv4XTw%2B1zPhC%2FUjGeCqUtcnpStPhfi7qCpdEzxQPXKoWpxcrvniZZ3cVNKqQOXUFCF%2FE2VW4ZuDYXjWKqyBs2DaWN%2Fab7BMWXer8oiaDXlyrXFKjUy8xIlUG6RnI5ImL8y1LR1GRt8msuOa1Pd6Z1G6CHJkDrNMvLKr4enFyejX0fnN2TWCHpIMWIVDEN%2FVoz1oA3Ww0zHh%2FS4GUEeJYIXchMvh9Wi3ilMm9LieZ2qupre4P1e9CT39Prj3NuYfiemcsVjtSckDqKqeRQahLinEeqqbAGd1IfRTbyMd1X7lEmlt6Atmo3EJbwkLQrNNy%2BciJU%2BpoeuzbwPIu1AWMwLVQtz22kIZdPZbwA2tqldX%2BpETJMMl7BmGN6ml32hsDD2jO7NJjS1AljmenioDabhS6%2BV53tLznvohRyV9heM6JswCWWSx9qcEWzR%2BzEQ6zwdwWwbvEW1YRioyEeXG4PbdiEVEX4WvN3ig4%2FMzXMRbzxjQfg1sT2PgcMugBqeYYxnPYlEgwaH1Ig4lcnNjZdVCuqpaphL5oFHyjFoNs7Uk0J6mDO6UEvTtaVQ4d1r5W0Lcdbe2%2Bbbf9%2F1ev%2B%2Fv9P2WMnneSFfKbkv2H6q9nu86W17fQ82%2B5%2FdbmtRylaZX7xe%2Fa5UqGVhqzt8a0S3OWypVo1dKVW1%2BrfKJbW3TsNPXTe%2F933R3db%2F6A6uoOxk%3D",R="?data=eJydVm1v2kgQ%2FisjS1eZYIxNQtOS0ipKuSu6BtKQ3BeCTgsssXV%2Bq70u0Ij%2FfjO7XttQiE5nKcY7%2BzzPzs7Lbl6MRbzkRs9ot%2FOMw1%2Fjr4%2B3AwBwbMcBEYNrOwDzLY7dq6dIga4f%2FgT5IMglEP52FchBQ1YCPw8mNwXQBQJ2bCjU9nC%2F3w%2B%2BSVwXF5OrvsPVEec64P0sYV%2Bu72%2FHo%2BENOqVgl4Wca5eY4eim9E1iLo5sYHJ3fTMoQF1QOzgvHdOwP1J%2FCaPxw2BCfrxFM03cMuHBFx4kPIVVHi2EH0fZUxRwAYuAhQn0wdxYwCyYN6D%2FEQhvh2xjokV9%2B5E5t2DTaCjWKmAiE1wSiUVTRJRqprmBFrAGtMGcyy8LHAvcgssZ7gZ5QjIEfAC7C5%2BgA2c4oL8etFxognmBXGlt0EuRszCOhXdsaZI1tV%2FlTLFm6G8qfCjxDEVNqpQWGZowx3EowziJ82gJk20kPJ752WHEkjyV%2Fq9S%2Ft0CUQUswyCRsdgIuS7td8PCC5H6LHoOjrPZPDPNit%2FCtHa6DfiNqpkC0JGuHg6KqHzP2a9O6eUq40dZYZ9kg1CUSz5bH5IrT2oeyDUVhYl%2FiLLU%2BCoxJuZamhVwyRdV6Gv75ZvEbHV1jKjYkCcOCqfQSNk6ioXcIP1WIkm8Nju2pczIeG8T2e00qO7VzsIk4BkypzNleU5Z4qnhKk7B1CiEOFfq6wNMrm%2Fvvg7%2Bvhk%2Fjh6UsdlswMtTBCATiWCJbMP99cPgSttpHYxwOU7luJr2wzwQLOJxLpFkl71qoycDtvBMM43XFuBrGC25qmu5qOInvlh4SFScgEfP2NatEq6AOKrkFnFgAb5%2BkVOC8WqVcdqMhmA65DmjQXqjbdomLqUIV3q63R5HwRbZYZJj%2FDPZOMJjuFXBUsGXwNDgsQwwP7Clg8OP%2FMzjS63gr4CchDdvQGB1yl%2BMPx3CGG%2FQMHrq0Wv23WpKpvEHS8FXOfRRQB%2B7OCozpx95gFF193VhmTKyVOPyVD%2BriguPZgv8xiE981hC5UhnQdk2hyAqPV%2FkSwKWgo7dPRRModmvgc%2BUeoXYVZ8ZQVOEYPuZeKVZ6nDEHlMjitu%2BK6kutJrSTs6rt2yHKeV41t8LMU0W3aOmqRRwreK2fYpQLOUiTyMV3QJrlaJZD6baKA3YcTvDMhKWsjAzetMXI2IhXeOfH7G8huMRTuJFY%2FQoRgaeCEbPdSyDzhSyuZbxgwU5Elz70tl7OpaRR75AqczYWaWucrVU1Zp7kgXPKMXxVt0Xdy5qkhjlykvHLSTpSq5UHcet%2BVMTdtwDabemTKmrpLVypyZ7QtV9X1Oh%2BtUq3XLH%2BJ%2BJ1qGIFirez0qme%2BnUVHT3aCXtzWWpciRwnZoAts1h2C9eD3udLc83nFr7S%2BEplz3uP3vIeGsZYpsQ6Bn%2F06no0%2BmKBRm3Tr1Fmp8yz6yT3BrruMBR7itrvcI9wToOKbn%2FgXXM6f9DU8Ga1fIkr4paO3TLdjg%2FWrZ7VXu%2Bm%2B3%2BBWEwbUk%3D";function z(e,t){for(var n=e.getContext("2d"),r=function(r){var a=t[r],o=e.height,c=e.width/t.length;if(n.resetTransform(),n.translate(r*c,0),n.width=c,n.height=o,n.clearRect(0,0,c,o),void 0===a||!Array.isArray(a)&&a.constructor!==Float32Array||a.length<2)return n.fillStyle="rgb(30,70,70)",n.fillRect(0,0,c,o),n.fillStyle="rgb(70,0,0)",n.fillRect(1,1,c-1,o-1),"continue";n.fillStyle="rgb(30,30,30)",n.fillRect(0,0,c,o),n.fillStyle="rgb(30,70,70)",r<t.length-1&&n.fillRect(c-1,0,1,o);var u=a.reduce((function(e,t){return t<e?t:e})),s=a.reduce((function(e,t){return t>e?t:e})),l=s-u;function d(e){return o-(e-u)/(s-u)*o}function f(e){return 10+e/(a.length-1)*(c-20)}s+=.1*l,u-=.1*l,n.strokeStyle="#977",n.lineWidth="1",n.beginPath(),n.moveTo(0,d(0)),n.lineTo(c,d(0));var h=Math.ceil(d(-1))+.5;n.moveTo(0,h),n.lineTo(c,h);var p=Math.floor(d(1))-.5;for(n.moveTo(0,p),n.lineTo(c,p),n.stroke(),n.beginPath(),n.moveTo(f(0),d(a[0])),i=0;i<a.length;i++){var b=a[i];n.lineTo(f(i),d(b))}n.strokeStyle=r%2===0?"rgb(96, 197, 177)":"rgb(100, 153, 211)",n.lineWidth="1",n.stroke()},a=0;a<t.length;a++){var i;r(a)}}var I=function(e){var t=window.location.protocol+"//"+window.location.host+window.location.pathname+e;window.history.pushState({path:t},"",t)},q=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:window.location.search,r=C.parse(n),a=C.stringify(Object(f.a)(Object(f.a)({},r),{},Object(d.a)({},e,t)));I("?".concat(a))},T=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window.location.search,n=C.parse(t);return n[e]};function A(){Object(O.b)();var e=function(){var e=Object(r.useState)({width:void 0,height:void 0}),t=Object(h.a)(e,2),n=t[0],a=t[1];return Object(r.useEffect)((function(){function e(){a({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),n}(),t=Object(r.useState)(),n=Object(h.a)(t,2),a=n[0],i=n[1],o=Object(r.useState)({code:"return Array.from(Array(SAMPLE_COUNT).keys()).map(e => 0.0)",params:[]}),u=Object(h.a)(o,2),d=u[0],b=u[1],v=Object(r.useCallback)((function(){var e=null===a||void 0===a?void 0:a.codeResult;e&&z(H.current,e.graphs||[e.samples]||[])}),[a]);Object(r.useEffect)((function(){v()}),[e]);var x=Object(r.useState)(!0),j=Object(h.a)(x,2),g=j[0],w=j[1],y=Object(r.useState)(0),F=Object(h.a)(y,2),C=F[0],I=F[1];var A=Object(r.useRef)(!1);function P(e){A.current=e}function D(e){function t(){return(t=Object(l.a)(s.a.mark((function e(t){var n,r,a,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=T("data",t))){e.next=8;break}return e.next=4,k.compressedB64ToObj(n);case 4:r=e.sent,a=r.code,i=r.params,b({code:a,params:i});case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(e){t.apply(this,arguments)}(e)}Object(r.useEffect)((function(){function e(){return(e=Object(l.a)(s.a.mark((function e(){var t,n,r,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t=T("data"))){e.next=10;break}return e.next=4,k.compressedB64ToObj(t);case 4:n=e.sent,r=n.code,a=n.params,b({code:r,params:a}),e.next=11;break;case 10:D(S);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]);var H=Object(r.useRef)();Object(r.useEffect)((function(){var e=Object(c.a)(d.code.matchAll("//use ([a-zA-Z0-9_]+) +([0-9.]+) +to +([0-9.]+) +by +([0-9.]*)+ *([a-zA-Z/0-9]*) *; *\n")),t={},n=d.params.slice(),r=!1;-1===n.findIndex((function(e){return"DURATION"===e.name}))&&(r=!0,n.push({name:"DURATION",min:.5,max:10,step:.1,value:1,unit:"s"})),n.forEach((function(e){t[e.name]=0})),t.DURATION=1;for(var a=function(){var a,o,c,u=e[i][1];a=parseFloat(e[i][2]),o=parseFloat(e[i][3]),c=parseFloat(e[i][4]);var s=e[i][5]||"",l=n.findIndex((function(e){return e.name===u}));if(-1===l)r=!0,n.push({name:u,min:a,max:o,step:c,unit:s,value:a>0?Math.sqrt(o*a):o/2});else{var d=n[l];d.min===a&&d.max===o&&d.step===c&&d.unit==s||(r=!0,d.min=a,d.max=o,d.step=c,d.unit=s,d.value=d.value>=a&&d.value<=o?d.value:a>0?Math.sqrt(o*a):o/2)}t[u]=(t[u]||0)+1},i=0;i<(null===e||void 0===e?void 0:e.length);i++)a();var o=Object(c.a)(d.code.matchAll("//useGrid ([a-zA-Z0-9_]+) +([0-9]+) +([0-9]+) *; *\n")),u=function(){var e=o[i][1];t[e]=(t[e]||0)+1;var a=parseInt(o[i][2]),c=parseInt(o[i][3]),u=n.findIndex((function(t){return t.name===e}));if(-1===u){r=!0;for(var s=[],l=0;l<c;l++){s[l]=[];for(var d=0;d<a;d++)s[l][d]=!1}n.push({name:e,width:a,height:c,type:"grid",value:s})}else{var f=n[u];if(f.width!==a||f.height!==c||"grid"!==f.type){for(var h=[],p=0;p<c;p++){h[p]=[];for(var b=0;b<a;b++)h[p][b]=!1}r=!0,f.width=a,f.height=c,f.type="grid",f.value=h}}};for(i=0;i<(null===o||void 0===o?void 0:o.length);i++)u();n=n.filter((function(e){return t[e.name]>0||(r=!0,!1)})),!0===r&&function(e){b((function(t){return Object(f.a)(Object(f.a)({},t),{},{params:e})}))}(n)}),[d]);var X=Object(r.useState)({valid:!1,hash:0}),L=Object(h.a)(X,2),Q=L[0],U=L[1];Object(r.useEffect)((function(){function e(){return(e=Object(l.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k.testSetting(d);case 2:t=e.sent,U(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[d]);var G=Object(r.useCallback)(Object(l.a)(s.a.mark((function e(){var t,n,r,o,c,u,h,p,b,v,x,j,g,m,O;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!a||!a.audioCtx||!0!==Q.valid){e.next=36;break}if(n=function(){var e=Object(l.a)(s.a.mark((function e(t){var n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k.objToCompressedB64(t);case 2:n=e.sent,q("data",n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),a.gainNode)try{for(.05,r=.05*a.audioCtx.sampleRate/10,o=new Float32Array(r),c=0;c<r;c++)o[c]=Math.pow(1-c/(r-1),2);a.gainNode.gain.setValueCurveAtTime(o,a.audioCtx.currentTime,.05)}catch(y){a.source.stop()}return u=(null===(t=d.params.find((function(e){return"DURATION"===e.name})))||void 0===t?void 0:t.value)||1,h=Math.ceil(a.audioCtx.sampleRate*u),p=null,e.prev=6,P(!0),b=performance.now(),e.next=11,k.computeSetting(d,h,a.audioCtx.sampleRate);case 11:p=e.sent,v=performance.now(),I(v-b),console.log("Compute took ",v-b+"ms"),Array.isArray(p)&&(p={samples:p}),e.next=21;break;case 18:return e.prev=18,e.t0=e.catch(6),e.abrupt("return");case 21:return e.prev=21,setTimeout((function(){P(!1),w(!0)}),100),e.finish(21);case 24:for(x=a.audioCtx.createBuffer(1,h,a.audioCtx.sampleRate),j=0;j<x.numberOfChannels;j++)for(g=x.getChannelData(j),c=0;c<x.length;c++)g[c]=p.samples[c];n(M(d)),(m=a.audioCtx.createBufferSource()).buffer=x,(O=a.audioCtx.createGain()).gain.value=1,m.connect(O),O.connect(a.audioCtx.destination),m.start(),z(H.current,p.graphs||[p.samples]||[]),i((function(e){return Object(f.a)(Object(f.a)({},e),{},{source:m,gainNode:O,hash:null===Q||void 0===Q?void 0:Q.hash,codeResult:p})}));case 36:case"end":return e.stop()}}),e,null,[[6,18,21,24]])}))),[a,Q,d]);return Object(r.useEffect)((function(){g&&(!0!==Q.valid||(null===a||void 0===a?void 0:a.hash)===(null===Q||void 0===Q?void 0:Q.hash)||A.current?!0===Q.valid&&(null===a||void 0===a?void 0:a.hash)!==(null===Q||void 0===Q?void 0:Q.hash)&&A.current&&w(!1):G())}),[Q,G,a,d,g]),Object(r.useEffect)((function(){var e=new(window.AudioContext||window.webkitAudioContext);i({audioCtx:e})}),[]),Object(p.jsxs)("div",{style:{display:"flex",flexDirection:"column",background:"rgb(62, 62, 62)",height:window.innerHeight,overflow:"hidden"},children:[Object(p.jsxs)("div",{style:{display:"flex",flexDirection:"row",background:"rgb(62, 62, 62)",flex:"1 1 auto",overflow:"hidden"},children:[Object(p.jsxs)("div",{style:{display:"flex",flexDirection:"column",flex:"1 60 auto",margin:"5px",marginRight:"0px",padding:"10px",background:"rgb(30 30 30)",borderRadius:"3px",overflow:"hidden"},children:[Object(p.jsx)("button",{style:{padding:"10px",backgroundColor:"#099",border:"none",borderRadius:"3px"},onClick:function(){G()},children:"Play"}),Object(p.jsx)("div",{style:{display:"flex",flexDirection:"row",marginTop:"10px"},children:[["Tutorial 1",V],["Tutorial 2",W],["Tutorial 3",S],["Tutorial 4",E],["Tutorial 5",R]].map((function(e){var t=Object(h.a)(e,2),n=t[0],r=t[1];return Object(p.jsx)("button",{style:{padding:"3px",marginRight:"3px",backgroundColor:"#099",border:"none",borderRadius:"3px"},onClick:function(){return D(r)},children:n})}))}),Object(p.jsxs)("div",{style:{fontSize:"0.8em",marginTop:"10px",color:"white",textAlign:"left"},children:[Object(p.jsx)("div",{children:" Write your sound function on the right !"}),Object(p.jsx)("div",{children:"The samples you return will be played on your speaker, and the graphs your return plotted."})]}),Object(p.jsx)("div",{style:{display:"flex",flexDirection:"row",flex:"1 1 auto",marginTop:"20px",flexWrap:"wrap",overflowY:"auto"},children:d.params.map((function(e){return Object(p.jsxs)("div",{style:{display:"flex",flexDirection:"row"},children:[!e.type&&Object(p.jsx)(m,{name:e.name,min:e.min,max:e.max,step:e.step,value:e.value,unit:e.unit,onChange:function(t){return b((function(n){var r=n.params.slice(),a=r.find((function(t){return t.name===e.name}));return a&&(a.value=t),Object(f.a)(Object(f.a)({},n),{},{params:r})}))}}),"grid"===e.type&&Object(p.jsx)(B,{name:e.name,value:e.value,onChange:function(t){b((function(n){var r=n.params.slice(),a=r.find((function(t){return t.name===e.name}));return a&&(a.value=t),Object(f.a)(Object(f.a)({},n),{},{params:r})}))}})]})}))})]}),Object(p.jsxs)("div",{style:{flex:"1 1 auto",margin:"5px",padding:"0px",background:"rgb(30 30 30)",minWidth:"677px",borderRadius:"3px",overflow:"hidden",position:"relative"},children:[Object(p.jsx)(O.a,{height:"60vh",defaultLanguage:"javascript",defaultValue:d.code,value:d.code,onChange:function(e,t){return n=e,void b((function(e){return Object(f.a)(Object(f.a)({},e),{},{code:n})}));var n},theme:"vs-dark",options:{fontSize:"12"}}),Object(p.jsx)("div",{style:{color:"grey",fontSize:"0.7em",textAlign:"right",position:"absolute",bottom:"0px",right:"0px"},children:Math.floor(C)+" ms"})]})]}),Object(p.jsx)("div",{style:{margin:"0px 5px 5px 5px",padding:"0px",flex:"none",borderRadius:"3px",overflow:"hidden",height:Math.floor(.35*e.height)+"px"},children:Object(p.jsx)("canvas",{ref:H,width:e.width-10,height:Math.floor(.35*e.height)})})]})}var P=function(){return Object(p.jsx)("div",{className:"App",children:Object(p.jsx)(A,{})})},D=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,454)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,i=t.getLCP,o=t.getTTFB;n(e),r(e),a(e),i(e),o(e)}))};o.a.render(Object(p.jsx)(a.a.StrictMode,{children:Object(p.jsx)(P,{})}),document.getElementById("root")),D()}},[[452,1,2]]]);
//# sourceMappingURL=main.7bb702ce.chunk.js.map