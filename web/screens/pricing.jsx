// Pricing page wireframes
// V1: classic 3 cards, year scaled up center
// V2: editorial table, year-row highlighted
// V3: single hero card with toggle, year as default

const PricingV1 = () => (
  <div className="wf scroll">
    <window.WireNav />
    <div style={{padding:'56px 40px 24px',textAlign:'center',position:'relative'}}>
      <div className="h1" style={{fontSize:42}}>Тарифы</div>
      <div className="body" style={{color:'#5a5048',marginTop:10,maxWidth:480,margin:'10px auto 0'}}>
        Один доступ ко всему каталогу. Отмена в один клик.
      </div>
    </div>
    <div style={{padding:'24px 40px 32px',display:'grid',gridTemplateColumns:'1fr 1.1fr 1fr',gap:18,maxWidth:980,margin:'0 auto',alignItems:'center'}}>
      {[
        {t:'Месяц',p:'590 ₽',u:'в месяц',b:null,f:false},
        {t:'Год',p:'4 990 ₽',u:'≈ 416 ₽/мес',b:'лучшая цена · −30%',f:true},
        {t:'Квартал',p:'1 490 ₽',u:'≈ 497 ₽/мес',b:'−16%',f:false},
      ].map((c,i)=>{
        const order = i===1?2:i===0?1:3;
        return (
          <div key={i} className={`box ${c.f?'fill-accent thick':''}`} style={{
            padding:c.f?28:22,order,
            transform: c.f?'translateY(-12px)':''
          }}>
            {c.b && <div className="chip accent" style={{marginBottom:10}}>{c.b}</div>}
            <div className="h3">{c.t}</div>
            <div className="h1" style={{fontSize:c.f?44:34,marginTop:10,color:c.f?'#3D5A40':'#2a251f'}}>{c.p}</div>
            <div className="body" style={{color:'#5a5048'}}>{c.u}</div>
            <div className="btn primary" style={{marginTop:18,width:'100%'}}>Выбрать</div>
          </div>
        );
      })}
    </div>
    {/* Features list */}
    <div style={{padding:'40px',maxWidth:760,margin:'0 auto'}}>
      <div className="label" style={{marginBottom:14,textAlign:'center'}}>в любом тарифе</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {['Все 42 урока','Watermark с email','Доступ навсегда после оплаты года',
          'Email с новинками','Поддержка в течение суток','Возврат в первые 7 дней'].map((f,i)=>(
          <div key={i} className="row" style={{gap:10,alignItems:'flex-start'}}>
            <div style={{color:'#3D5A40',fontFamily:'Caveat',fontWeight:700,fontSize:18,lineHeight:1}}>✓</div>
            <div className="body">{f}</div>
          </div>
        ))}
      </div>
    </div>
    <window.WireFooter />
  </div>
);

const PricingV2 = () => (
  <div className="wf scroll">
    <window.WireNav />
    <div style={{padding:'56px 80px 24px'}}>
      <div className="h1" style={{fontSize:42}}>Тарифы</div>
      <div className="body" style={{color:'#5a5048',marginTop:10,maxWidth:520}}>
        Один доступ ко всему каталогу. Чем дольше — тем дешевле в пересчёте на месяц.
      </div>
    </div>
    {/* Table */}
    <div style={{padding:'24px 80px 40px',position:'relative'}}>
      <div className="box" style={{padding:0,overflow:'hidden',maxWidth:820}}>
        {/* Header row */}
        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr 130px',gap:12,padding:'14px 24px',borderBottom:'1.5px solid #2a251f',background:'#efece4'}}>
          <div className="label">тариф</div>
          <div className="label">цена</div>
          <div className="label">в месяц</div>
          <div className="label">скидка</div>
          <div></div>
        </div>
        {[
          {t:'Месяц',p:'590 ₽',m:'590 ₽',d:'—',f:false},
          {t:'Квартал',p:'1 490 ₽',m:'≈ 497 ₽',d:'−16%',f:false},
          {t:'Год',p:'4 990 ₽',m:'≈ 416 ₽',d:'−30% · лучшая',f:true},
        ].map((r,i)=>(
          <div key={i} style={{
            display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr 130px',gap:12,
            padding:'20px 24px',
            borderBottom:i<2?'1px solid #d4d0c4':'none',
            background:r.f?'#d9e2d8':'transparent',alignItems:'center'
          }}>
            <div className="h3">{r.t}</div>
            <div className="h2" style={{fontSize:24,color:r.f?'#3D5A40':'#2a251f'}}>{r.p}</div>
            <div className="body">{r.m}</div>
            <div className="body" style={{color:'#5a5048'}}>{r.d}</div>
            <div className={`btn sm ${r.f?'primary':''}`}>Выбрать</div>
          </div>
        ))}
      </div>
      <div className="note" style={{right:60,top:60}}>
        <span className="arrow">↙</span>
        год выделен фоном,<br/>не масштабом
      </div>
    </div>
    {/* Features inline */}
    <div style={{padding:'24px 80px 56px'}}>
      <div className="label" style={{marginBottom:14}}>в любом тарифе</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,maxWidth:820}}>
        {['Все 42 урока','Watermark с email','Доступ навсегда после года','Email с новинками','Возврат 7 дней','Поддержка'].map((f,i)=>(
          <div key={i} className="row" style={{gap:8,alignItems:'baseline'}}>
            <div className="mono" style={{color:'#3D5A40'}}>✓</div>
            <div className="body" style={{fontSize:13}}>{f}</div>
          </div>
        ))}
      </div>
    </div>
    <window.WireFooter />
  </div>
);

const PricingV3 = () => (
  <div className="wf scroll">
    <window.WireNav />
    <div style={{padding:'56px 40px 16px',textAlign:'center'}}>
      <div className="h1" style={{fontSize:42}}>Один тариф,<br/>три длины.</div>
    </div>
    {/* Toggle */}
    <div style={{padding:'24px 40px 8px',textAlign:'center'}}>
      <div className="box" style={{display:'inline-flex',padding:4,gap:0}}>
        {['Месяц','Квартал','Год · −30%'].map((t,i)=>(
          <div key={i} style={{
            padding:'8px 18px',
            background:i===2?'#3D5A40':'transparent',
            color:i===2?'#f4f1ea':'#2a251f',
            borderRadius:14,
            fontFamily:'Caveat',fontWeight:600,fontSize:16
          }}>{t}</div>
        ))}
      </div>
    </div>
    {/* Single hero card */}
    <div style={{padding:'24px 40px 40px',position:'relative'}}>
      <div className="box fill-accent thick" style={{maxWidth:560,margin:'0 auto',padding:36,textAlign:'center'}}>
        <div className="chip accent" style={{marginBottom:14}}>лучшая цена</div>
        <div className="h1" style={{fontSize:64,color:'#3D5A40'}}>4 990 ₽</div>
        <div className="body" style={{marginTop:8,color:'#5a5048'}}>в год · ≈ 416 ₽ в месяц</div>
        <div className="line w50" style={{margin:'24px auto'}}/>
        <div className="col" style={{gap:8,textAlign:'left',maxWidth:340,margin:'0 auto'}}>
          {['Все 42 урока + 6 новых каждый месяц','Watermark с вашим email','Доступ навсегда после года','Возврат в первые 7 дней'].map((f,i)=>(
            <div key={i} className="row" style={{gap:10}}>
              <div className="mono" style={{color:'#3D5A40'}}>✓</div>
              <div className="body" style={{fontSize:14}}>{f}</div>
            </div>
          ))}
        </div>
        <div className="btn primary" style={{marginTop:24,padding:'12px 32px',fontSize:18}}>Оформить подписку</div>
        <div className="mono" style={{fontSize:10,color:'#5a5048',marginTop:12}}>7 дней бесплатно · отмена в один клик</div>
      </div>
      <div className="note" style={{right:60,top:80}}>
        <span className="arrow">↙</span>
        год — дефолт.<br/>остальные тарифы<br/>через переключатель
      </div>
    </div>
    <window.WireFooter />
  </div>
);

window.PricingV1 = PricingV1;
window.PricingV2 = PricingV2;
window.PricingV3 = PricingV3;
