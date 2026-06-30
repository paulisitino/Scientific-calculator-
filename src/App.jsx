import { useState, useCallback } from "react";
const BUTTONS=[["Rad","Deg","x!","(",")",  "mc","m+","m-","mr","AC"],["2nd","x²","x³","xʸ","eˣ","10ˣ","7","8","9","÷"],["1/x","√x","∛x","ʸ√x","ln","log","4","5","6","×"],["x%","sin","cos","tan","e","EE","1","2","3","−"],["±","sinh","cosh","tanh","π","Rand","0",".","=","+"]];
const isDigit=(v)=>/^[0-9]$/.test(v);
const isOp=(v)=>["+","−","×","÷"].includes(v);
function factorial(n){if(n<0||!Number.isInteger(n))return NaN;if(n===0||n===1)return 1;let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
function applyOp(a,op,b){switch(op){case"+":return a+b;case"−":return a-b;case"×":return a*b;case"÷":return b===0?NaN:a/b;case"xʸ":return Math.pow(a,b);case"ʸ√x":return Math.pow(b,1/a);case"EE":return a*Math.pow(10,b);default:return b;}}
export default function App(){
  const[display,setDisplay]=useState("0");
  const[expr,setExpr]=useState("");
  const[firstOp,setFirstOp]=useState(null);
  const[pendingOp,setPendingOp]=useState(null);
  const[justEvaled,setJustEvaled]=useState(false);
  const[isDeg,setIsDeg]=useState(true);
  const[is2nd,setIs2nd]=useState(false);
  const[mem,setMem]=useState(0);
  const[openParens,setOpenParens]=useState(0);
  const toRad=(x)=>isDeg?(x*Math.PI)/180:x;
  const fromRad=(x)=>isDeg?(x*180)/Math.PI:x;
  const formatNum=(n)=>{if(isNaN(n))return"Error";if(!isFinite(n))return n>0?"∞":"-∞";const s=parseFloat(n.toPrecision(10)).toString();return s.length>14?n.toExponential(6):s;};
  const reset=()=>{setDisplay("0");setExpr("");setFirstOp(null);setPendingOp(null);setJustEvaled(false);setOpenParens(0);};
  const evaluate=useCallback(()=>{if(pendingOp&&firstOp!==null){const a=firstOp;const b=parseFloat(display);const result=applyOp(a,pendingOp,b);const formatted=formatNum(result);setExpr(expr+display+" =");setDisplay(formatted);setFirstOp(null);setPendingOp(null);setJustEvaled(true);}},[pendingOp,firstOp,display,expr]);
  const handleButton=(val)=>{
    const cur=parseFloat(display);
    if(val==="Rad"||val==="Deg"){setIsDeg(val==="Deg");return;}
    if(val==="2nd"){setIs2nd(!is2nd);return;}
    if(val==="mc"){setMem(0);return;}
    if(val==="m+"){setMem(m=>m+cur);return;}
    if(val==="m-"){setMem(m=>m-cur);return;}
    if(val==="mr"){setDisplay(formatNum(mem));setJustEvaled(true);return;}
    if(val==="AC"){reset();return;}
    if(val==="Rand"){const r=formatNum(Math.random());setDisplay(r);setExpr("Rand");setJustEvaled(true);return;}
    if(isDigit(val)){if(justEvaled){setDisplay(val);setExpr("");setJustEvaled(false);return;}setDisplay(display==="0"?val:display+val);return;}
    if(val==="."){if(justEvaled){setDisplay("0.");setJustEvaled(false);return;}if(!display.includes("."))setDisplay(display+".");return;}
    if(val==="±"){setDisplay(formatNum(-cur));return;}
    if(val==="x%"){setDisplay(formatNum(cur/100));return;}
    if(val==="("){setExpr(expr+"(");setOpenParens(o=>o+1);setDisplay("0");setJustEvaled(false);return;}
    if(val===")"){if(openParens===0)return;setExpr(expr+display+")");setOpenParens(o=>o-1);setJustEvaled(true);return;}
    if(isOp(val)||val==="xʸ"||val==="ʸ√x"||val==="EE"){if(pendingOp&&!justEvaled){const r=applyOp(firstOp,pendingOp,cur);setDisplay(formatNum(r));setFirstOp(r);setExpr(formatNum(r)+" "+val+" ");}else{setFirstOp(cur);setExpr(display+" "+val+" ");}setPendingOp(val);setJustEvaled(false);setDisplay("0");return;}
    if(val==="="){evaluate();return;}
    let result;
    switch(val){
      case"x²":result=Math.pow(cur,2);break;
      case"x³":result=Math.pow(cur,3);break;
      case"x!":result=factorial(Math.round(cur));break;
      case"1/x":result=1/cur;break;
      case"√x":result=Math.sqrt(cur);break;
      case"∛x":result=Math.cbrt(cur);break;
      case"eˣ":result=Math.exp(cur);break;
      case"10ˣ":result=Math.pow(10,cur);break;
      case"ln":result=Math.log(cur);break;
      case"log":result=Math.log10(cur);break;
      case"e":setDisplay(formatNum(Math.E));setJustEvaled(true);return;
      case"π":setDisplay(formatNum(Math.PI));setJustEvaled(true);return;
      case"sin":result=is2nd?fromRad(Math.asin(cur)):Math.sin(toRad(cur));break;
      case"cos":result=is2nd?fromRad(Math.acos(cur)):Math.cos(toRad(cur));break;
      case"tan":result=is2nd?fromRad(Math.atan(cur)):Math.tan(toRad(cur));break;
      case"sinh":result=is2nd?Math.asinh(cur):Math.sinh(cur);break;
      case"cosh":result=is2nd?Math.acosh(cur):Math.cosh(cur);break;
      case"tanh":result=is2nd?Math.atanh(cur):Math.tanh(cur);break;
      default:return;
    }
    setExpr(val+"("+display+") =");setDisplay(formatNum(result));setJustEvaled(true);setIs2nd(false);
  };
  const btnStyle=(val)=>{const base={display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",cursor:"pointer",fontSize:"13px",fontWeight:"500",border:"none",outline:"none",transition:"filter 0.1s,transform 0.08s",userSelect:"none",width:"52px",height:"52px"};if(val==="="||isOp(val))return{...base,background:"#ff9f0a",color:"#fff"};if(["AC","±","x%","mc","m+","m-","mr","2nd","Rad","Deg"].includes(val))return{...base,background:"#636366",color:"#fff",fontSize:"12px"};return{...base,background:"#1c1c1e",color:"#fff"};};
  return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000",fontFamily:"-apple-system,'SF Pro Display',sans-serif"}}><div style={{width:"min(380px,96vw)",background:"#000",borderRadius:"20px",padding:"16px",boxShadow:"0 0 60px rgba(255,159,10,0.08)"}}><div style={{textAlign:"right",padding:"12px 8px 4px",minHeight:"90px"}}><div style={{color:"#636366",fontSize:"13px",minHeight:"20px",marginBottom:"4px",wordBreak:"break-all"}}>{expr||"\u00a0"}</div><div style={{color:"#fff",fontSize:display.length>10?"32px":"52px",fontWeight:"200",letterSpacing:"-1px",lineHeight:1,wordBreak:"break-all",transition:"font-size 0.15s"}}>{display}</div><div style={{color:"#636366",fontSize:"11px",marginTop:"4px"}}>{isDeg?"DEG":"RAD"}{is2nd?" · 2nd":""}{mem!==0?" · M":""}</div></div><div style={{display:"grid",gap:"10px",marginTop:"12px"}}>{BUTTONS.map((row,ri)=>(<div key={ri} style={{display:"grid",gridTemplateColumns:"repeat(10, 1fr)",gap:"8px"}}>{row.map((val)=>{let label=val;if(is2nd){const map={sin:"sin⁻¹",cos:"cos⁻¹",tan:"tan⁻¹",sinh:"sinh⁻¹",cosh:"cosh⁻¹",tanh:"tanh⁻¹","x²":"x^y","√x":"ʸ√x","eˣ":"yˣ","10ˣ":"2ˣ",ln:"logᵧ",log:"log₂"};label=map[val]||val;}return(<button key={val} onClick={()=>handleButton(val)} style={btnStyle(val)} onMouseOver={e=>e.currentTarget.style.filter="brightness(1.3)"} onMouseOut={e=>e.currentTarget.style.filter="brightness(1)"} onMouseDown={e=>e.currentTarget.style.transform="scale(0.93)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{label}</button>);})}</div>))}</div></div></div>);
}
