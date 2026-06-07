// Account dashboard wireframes
// V1: classic — sidebar nav + main content (Мои уроки)
// V2: minimal — single column, all 3 sections stacked

const AccountV1 = () => (
  <div className="wf scroll">
    <window.WireNav />
    <div style={{padding:'24px 40px 16px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
      <div className="h2">Кабинет</div>
      <div className="mono" style={{fontSize:11,color:'#8a8278'}}>учитель@школа.ру</div>
    </div>
    <div style={{padding:'0 40px 56px',display:'grid',gridTemplateColumns:'220px 1fr',gap:32,position:'relative'}}>
      {/* Sidebar */}
      <div style={{borderRight:'1.5px solid #2a251f',paddingRight:18,paddingTop:8}}>
        <div className="col" style={{gap:4}}>
          {[['Мои уроки',true],['Подписка',false],['Настройки',false]].map(([t,a],i)=>(
            <div key={i} className="row" style={{
              padding:'10px 12px',gap:10,alignItems:'center',
              background:a?'#d9e2d8':'transparent',
              border:a?'1.5px solid #3D5A40':'1.5px solid transparent',
              borderRadius:6
            }}>
              <div className="mono" style={{fontSize:9,color:'#8a8278'}}>0{i+1}</div>
              <div className="body" style={{fontWeight:a?600:400}}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:24,paddingTop:18,borderTop:'1px solid #d4d0c4'}}>
          <div className="mono" style={{fontSize:10,color:'#8a8278',marginBottom:4}}>подписка активна</div>
          <div className="body" style={{fontSize:13}}>до 12 мая 2026</div>
          <div className="mono" style={{fontSize:10,color:'#8a8278',marginTop:6}}>год · 4 990 ₽</div>
        </div>
        <div className="note" style={{left:0,top:200}}>
          <span className="arrow">↑</span>
          3 пункта sidebar
        </div>
      </div>
      {/* Main */}
      <div>
        <div className="row" style={{justifyContent:'space-between',alignItems:'baseline',marginBottom:18}}>
          <div className="h3">Недавно скачанные</div>
          <div className="mono" style={{fontSize:11,color:'#8a8278'}}>всего 14</div>
        </div>
        <div className="box" style={{padding:0}}>
          {[
            ['Теорема Виета','8 класс · алгебра','3 апреля'],
            ['Производная функции','10 класс · алгебра','29 марта'],
            ['Циклы while','9 класс · информатика','24 марта'],
            ['Логарифмическое уравнение','11 класс','21 марта'],
            ['Массивы. Сортировка','10 класс · информатика','15 марта'],
            ['Квадратное уравнение','8 класс · алгебра','12 марта'],
          ].map((r,i)=>(
            <div key={i} style={{
              display:'grid',gridTemplateColumns:'48px 1fr 1fr 100px 100px',gap:14,padding:'12px 18px',
              borderBottom:i<5?'1px solid #d4d0c4':'none',alignItems:'center'
            }}>
              <div className="ph" style={{width:40,height:30,fontSize:8,padding:0}}/>
              <div className="body" style={{fontWeight:600}}>{r[0]}</div>
              <div className="mono" style={{fontSize:11,color:'#5a5048'}}>{r[1]}</div>
              <div className="mono" style={{fontSize:10,color:'#8a8278'}}>{r[2]}</div>
              <div className="mono" style={{fontSize:11}}>скачать ↓</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AccountV2 = () => (
  <div className="wf scroll">
    <window.WireNav />
    <div style={{padding:'40px 80px 16px',position:'relative'}}>
      <div className="mono" style={{fontSize:11,color:'#8a8278'}}>учитель@школа.ру</div>
      <div className="h1" style={{fontSize:36,marginTop:6}}>Здравствуйте.</div>
    </div>
    <div style={{padding:'24px 80px 56px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,maxWidth:1100}}>
      {/* Subscription card */}
      <div className="box fill" style={{padding:24}}>
        <div className="label">подписка</div>
        <div className="h2" style={{marginTop:8,fontSize:26}}>Год · активна</div>
        <div className="body" style={{color:'#5a5048',marginTop:6}}>Следующее списание: 12 мая 2026 · 4 990 ₽</div>
        <div className="row" style={{gap:10,marginTop:18}}>
          <div className="btn ghost sm">Изменить тариф</div>
          <div className="btn ghost sm">Отменить</div>
        </div>
      </div>
      {/* Settings card */}
      <div className="box" style={{padding:24}}>
        <div className="label">настройки</div>
        <div className="col" style={{gap:14,marginTop:14}}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div className="body">Email</div>
            <div className="mono" style={{fontSize:11,color:'#5a5048'}}>учитель@школа.ру</div>
          </div>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div className="body">Уведомления о новинках</div>
            <div className="box" style={{width:32,height:18,borderRadius:9,background:'#3D5A40',position:'relative'}}>
              <div style={{position:'absolute',right:2,top:2,width:12,height:12,borderRadius:6,background:'#fdfcf8'}}/>
            </div>
          </div>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div className="body">Watermark</div>
            <div className="mono" style={{fontSize:11}}>email на всех PDF</div>
          </div>
        </div>
      </div>
      {/* Lessons full width */}
      <div style={{gridColumn:'1 / -1'}}>
        <div className="row" style={{justifyContent:'space-between',alignItems:'baseline',marginBottom:14}}>
          <div className="h2" style={{fontSize:26}}>Мои уроки</div>
          <div className="mono" style={{fontSize:11,color:'#8a8278'}}>14 скачанных</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:18}}>
          {Array.from({length:4}).map((_,i)=>(
            <div key={i} className="col" style={{gap:8}}>
              <div className="ph" style={{aspectRatio:'4/3'}}>урок {i+1}</div>
              <div className="body" style={{fontSize:13,fontWeight:600}}>Теорема Виета</div>
              <div className="mono" style={{fontSize:10,color:'#8a8278'}}>скачано 3 апреля</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="note" style={{position:'absolute',right:200,top:60}}>
      <span className="arrow">↙</span>
      без sidebar — всё на одном экране
    </div>
  </div>
);

window.AccountV1 = AccountV1;
window.AccountV2 = AccountV2;
