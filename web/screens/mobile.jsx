// Mobile wireframes — landing + catalog with bottom-sheet filter

const MobileLanding = () => (
  <div className="wf scroll" style={{fontSize:13}}>
    {/* simplified nav */}
    <div style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1.5px solid #2a251f'}}>
      <div className="logo" style={{fontFamily:'Caveat',fontWeight:700,fontSize:18}}>uroki</div>
      <div className="mono" style={{fontSize:11}}>≡</div>
    </div>
    <div style={{padding:'24px 18px'}}>
      <div className="h1" style={{fontSize:30}}>Готовые уроки.<br/>От учителя — учителю.</div>
      <div className="body" style={{color:'#5a5048',marginTop:12}}>
        Презентация и рабочий лист на каждый урок.
      </div>
      <div className="col" style={{gap:8,marginTop:18}}>
        <div className="btn primary" style={{width:'100%'}}>7 дней бесплатно</div>
        <div className="btn ghost" style={{width:'100%'}}>Каталог</div>
      </div>
    </div>
    <div className="ph" style={{aspectRatio:'4/3',margin:'8px 18px',fontSize:10}}>laptop mockup</div>
    <div style={{padding:'32px 18px',borderTop:'1.5px solid #2a251f',marginTop:24}}>
      <div className="h2" style={{fontSize:22}}>Что внутри</div>
      <div className="col" style={{gap:14,marginTop:14}}>
        {['Презентации','Рабочие листы','Ответы'].map((t,i)=>(
          <div key={i} className="box" style={{padding:14}}>
            <div className="h3" style={{fontSize:18}}>{t}</div>
            <div className="line w80 sm" style={{marginTop:6}}/>
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:'32px 18px',borderTop:'1.5px solid #2a251f',background:'#f6f3ec'}}>
      <div className="h2" style={{fontSize:22}}>Тарифы</div>
      <div className="col" style={{gap:10,marginTop:14}}>
        {[
          ['Год','4 990 ₽','лучшая цена',true],
          ['Квартал','1 490 ₽','−16%',false],
          ['Месяц','590 ₽','',false],
        ].map(([t,p,b,f],i)=>(
          <div key={i} className={`box ${f?'fill-accent thick':''}`} style={{padding:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div className="h3" style={{fontSize:16}}>{t}</div>
              {b && <div className="mono" style={{fontSize:9,color:'#5a5048'}}>{b}</div>}
            </div>
            <div className="h2" style={{fontSize:18,color:f?'#3D5A40':'#2a251f'}}>{p}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:'32px 18px 56px',borderTop:'1.5px solid #2a251f'}}>
      <div className="h2" style={{fontSize:22}}>Вопросы</div>
      {['Как происходит оплата','Можно ли вернуть','Подходит ли учебникам','Контрольные работы'].map((q,i)=>(
        <div key={i} style={{padding:'12px 0',borderBottom:'1px solid #d4d0c4',display:'flex',justifyContent:'space-between'}}>
          <div className="body" style={{fontSize:13}}>{q}</div><div className="mono">+</div>
        </div>
      ))}
    </div>
  </div>
);

const MobileCatalog = () => (
  <div className="wf" style={{fontSize:13,position:'relative'}}>
    <div style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1.5px solid #2a251f'}}>
      <div className="logo" style={{fontFamily:'Caveat',fontWeight:700,fontSize:18}}>uroki</div>
      <div className="mono" style={{fontSize:11}}>≡</div>
    </div>
    <div style={{padding:'18px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
      <div className="h2" style={{fontSize:24}}>Каталог</div>
      <div className="mono" style={{fontSize:10,color:'#8a8278'}}>42</div>
    </div>
    {/* Active filter chips */}
    <div style={{padding:'0 18px 14px',display:'flex',gap:6,flexWrap:'wrap'}}>
      <div className="chip accent">8 класс ×</div>
      <div className="chip accent">алгебра ×</div>
    </div>
    <div style={{padding:'0 18px',display:'grid',gridTemplateColumns:'1fr',gap:18,paddingBottom:80}}>
      {Array.from({length:5}).map((_,i)=>(
        <div key={i} className="row" style={{gap:12,paddingBottom:14,borderBottom:'1px solid #d4d0c4'}}>
          <div className="ph" style={{width:80,height:80,padding:0,fontSize:8,flex:'0 0 auto'}}/>
          <div className="col" style={{gap:4,flex:1}}>
            <div className="body" style={{fontWeight:600,fontSize:14}}>{['Теорема Виета','Квадратичная функция','Системы уравнений','Окружность','Дискриминант'][i]}</div>
            <div className="mono" style={{fontSize:10,color:'#5a5048'}}>8 класс · алгебра</div>
            <div className="mono" style={{fontSize:10,color:'#8a8278'}}>45 мин</div>
          </div>
        </div>
      ))}
    </div>
    {/* Bottom sheet trigger */}
    <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'12px 18px',background:'#fdfcf8',borderTop:'1.5px solid #2a251f',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div className="mono" style={{fontSize:11}}>фильтры · 2 активны</div>
      <div className="btn sm primary">Настроить ↑</div>
    </div>
    <div className="note" style={{right:20,bottom:80}}>
      <span className="arrow">↘</span>
      шторка с фильтрами<br/>выезжает снизу
    </div>
  </div>
);

window.MobileLanding = MobileLanding;
window.MobileCatalog = MobileCatalog;
