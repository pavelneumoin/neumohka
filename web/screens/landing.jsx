// Landing page wireframe variations
// V1: classic — text-left hero, screenshot right, conventional flow
// V2: editorial — centered serif-ish hero, big preview row as the star
// V3: utility-first — minimal, table-of-contents catalog teaser, no hero image

const Nav = ({ active = 'home' }) => (
  <div className="navbar">
    <div className="logo">uroki·подписка</div>
    <nav>
      <span style={{textDecoration: active==='cat'?'underline':'none'}}>Каталог</span>
      <span>Тарифы</span>
      <span>FAQ</span>
      <span className="mono" style={{fontSize:11}}>войти</span>
      <span className="btn sm primary">7 дней бесплатно</span>
    </nav>
  </div>
);

const Footer = () => (
  <div className="footer">
    <div>uroki-podpiska · ИНН 000000000000 · 2026</div>
    <div style={{display:'flex',gap:18}}>
      <span>оферта</span><span>политика</span><span>контакты</span>
    </div>
  </div>
);

// ---------- LANDING V1: classic ----------
const LandingV1 = () => (
  <div className="wf scroll">
    <Nav />

    {/* Hero */}
    <div style={{padding:'56px 80px 40px',display:'grid',gridTemplateColumns:'1.05fr 1fr',gap:40,alignItems:'center',position:'relative'}}>
      <div className="col" style={{gap:18}}>
        <div className="label">для учителей · 8–11 класс</div>
        <div className="h1" style={{fontSize:48,lineHeight:1.05}}>
          Готовые уроки<br/>математики и информатики.<br/>
          <span style={{color:'#3D5A40'}}>От учителя — учителю.</span>
        </div>
        <div className="body" style={{maxWidth:440,color:'#5a5048'}}>
          Презентация и рабочий лист на каждый урок. Экономьте 5–10 часов в неделю на подготовке.
        </div>
        <div className="row" style={{gap:12,marginTop:8}}>
          <div className="btn primary">7 дней бесплатно</div>
          <div className="btn ghost">Посмотреть каталог →</div>
        </div>
        <div className="mono" style={{fontSize:11,color:'#8a8278',marginTop:6}}>
          без карты · отмена в один клик
        </div>
      </div>
      <div style={{position:'relative'}}>
        <div className="ph" style={{aspectRatio:'4/3',borderRadius:'8px 12px 9px 11px'}}>laptop mockup<br/>preview of lesson slide</div>
        <div className="note" style={{top:-30,right:-10}}>
          <span className="arrow">↘</span>
          реальный скрин урока,<br/>не сток
        </div>
      </div>
      <div className="note" style={{left:60,top:30}}>
        <span className="arrow">↙</span>
        H1 48–56 px,<br/>акцент тёмно-зелёный
      </div>
    </div>

    {/* What's inside — 3 cols */}
    <div style={{padding:'72px 80px',borderTop:'1.5px solid #2a251f',background:'#f6f3ec'}}>
      <div className="h2" style={{textAlign:'center',marginBottom:32}}>Что внутри</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24}}>
        {[
          ['Презентации','PDF · 16–22 слайда'],
          ['Рабочие листы','A4 · готов к печати'],
          ['Ответы','к каждому листу'],
        ].map(([t,s],i)=>(
          <div key={i} className="box" style={{padding:24}}>
            <div className="ph" style={{width:36,height:36,borderRadius:6,marginBottom:14}} />
            <div className="h3">{t}</div>
            <div className="body" style={{color:'#5a5048',marginTop:6}}>{s}</div>
          </div>
        ))}
      </div>
    </div>

    {/* How it works */}
    <div style={{padding:'72px 80px'}}>
      <div className="h2" style={{marginBottom:32}}>Как работает</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:32,position:'relative'}}>
        {['Зарегистрировались','Выбрали урок','Скачали и провели'].map((t,i)=>(
          <div key={i}>
            <div className="mono" style={{fontSize:32,fontFamily:'Caveat',fontWeight:700,color:'#3D5A40'}}>0{i+1}</div>
            <div className="h3" style={{marginTop:4}}>{t}</div>
            <div className="line w80 sm" style={{marginTop:12}} />
            <div className="line w60 sm" style={{marginTop:6}} />
          </div>
        ))}
      </div>
    </div>

    {/* Carousel of slide previews — KEY */}
    <div style={{padding:'56px 0 72px',background:'#efece4',borderTop:'1.5px solid #2a251f',borderBottom:'1.5px solid #2a251f',position:'relative'}}>
      <div style={{padding:'0 80px',marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div>
          <div className="label">★ ключ доверия</div>
          <div className="h2" style={{marginTop:4}}>Скриншоты реальных уроков</div>
        </div>
        <div className="row" style={{gap:8}}>
          <div className="box" style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}}>←</div>
          <div className="box" style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}}>→</div>
        </div>
      </div>
      <div style={{display:'flex',gap:18,padding:'0 80px',overflow:'hidden'}}>
        {[1,2,3,4,5].map(i=>(
          <div key={i} className="ph" style={{flex:'0 0 320px',aspectRatio:'4/3'}}>
            slide {i}<br/>теорема Виета · 8 класс
          </div>
        ))}
      </div>
      <div className="note" style={{right:60,top:20}}>
        <span className="arrow">↑</span>
        это самое важное —<br/>показать качество
      </div>
    </div>

    {/* Pricing */}
    <div style={{padding:'72px 80px'}}>
      <div className="h2" style={{textAlign:'center',marginBottom:32}}>Тарифы</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:18,maxWidth:900,margin:'0 auto'}}>
        {[
          ['Месяц','590 ₽','в месяц',null],
          ['Год','4 990 ₽','в год','лучшая цена · −30%'],
          ['Квартал','1 490 ₽','за 3 месяца','−16%'],
        ].map(([t,p,u,b],i)=>{
          const featured = i===1;
          return (
            <div key={i} className={`box ${featured?'fill-accent thick':''}`}
              style={{padding:24,transform:featured?'translateY(-12px)':'',order:featured?2:i===0?1:3}}>
              {b && <div className="chip accent" style={{marginBottom:10}}>{b}</div>}
              <div className="h3">{t}</div>
              <div className="h1" style={{fontSize:36,marginTop:8}}>{p}</div>
              <div className="body" style={{color:'#5a5048'}}>{u}</div>
              <div className="btn primary" style={{marginTop:18,width:'100%'}}>Выбрать</div>
            </div>
          );
        })}
      </div>
    </div>

    {/* FAQ */}
    <div style={{padding:'72px 80px',background:'#f6f3ec',borderTop:'1.5px solid #2a251f'}}>
      <div className="h2" style={{marginBottom:24}}>Вопросы</div>
      <div className="col" style={{gap:0,maxWidth:800}}>
        {['Можно ли распечатывать рабочие листы для всего класса',
          'Что будет с уроками после отмены подписки',
          'Подходит ли учебникам Мерзляк, Макарычев',
          'Можно ли редактировать презентацию',
          'Как происходит оплата',
          'Есть ли материалы для контрольных'].map((q,i)=>(
          <div key={i} style={{padding:'18px 0',borderBottom:'1px solid #2a251f',display:'flex',justifyContent:'space-between'}}>
            <div className="body">{q}</div>
            <div className="mono">+</div>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);

// ---------- LANDING V2: editorial / preview-led ----------
const LandingV2 = () => (
  <div className="wf scroll">
    <Nav />

    {/* Editorial hero — centered */}
    <div style={{padding:'80px 80px 40px',textAlign:'center',position:'relative',maxWidth:900,margin:'0 auto'}}>
      <div className="label" style={{marginBottom:18}}>выпуск 12 · апрель 2026 · +6 новых уроков</div>
      <div className="h1" style={{fontSize:56,lineHeight:1.02,fontFamily:'Caveat',fontWeight:700}}>
        Готовые уроки.<br/>
        <span style={{fontStyle:'italic'}}>От учителя —</span><br/>
        учителю.
      </div>
      <div className="body" style={{maxWidth:520,margin:'24px auto',color:'#5a5048',fontSize:16}}>
        Каталог презентаций и рабочих листов по математике и информатике для 8–11 классов. 590 ₽ в месяц.
      </div>
      <div className="row" style={{gap:12,justifyContent:'center'}}>
        <div className="btn primary">7 дней бесплатно</div>
        <div className="btn ghost">Каталог →</div>
      </div>
      <div className="note" style={{left:20,top:80}}>
        <span className="arrow">↘</span>
        тон как у Substack:<br/>выпуск, дата, тираж
      </div>
    </div>

    {/* Preview row IS the hero proof */}
    <div style={{padding:'40px 0 80px'}}>
      <div style={{display:'flex',gap:14,padding:'0 40px',justifyContent:'center'}}>
        {[
          ['8 класс','теорема Виета',1.2],
          ['10 класс','производная',1],
          ['9 класс','функции',1],
          ['11 класс','логарифмы',0.8],
        ].map(([g,t,scale],i)=>(
          <div key={i} className="ph" style={{
            width:200*scale, height:140*scale,
            transform:`rotate(${[-2,1,-1,2][i]}deg) translateY(${[0,12,0,18][i]}px)`,
            flex:'0 0 auto'
          }}>
            <div>
              <div className="mono" style={{fontSize:9}}>{g}</div>
              <div className="h3" style={{marginTop:4,fontSize:14}}>{t}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mono" style={{textAlign:'center',color:'#8a8278',marginTop:24,fontSize:11}}>
        42 урока · 18 авторов · обновляется каждую неделю
      </div>
    </div>

    {/* Inline what's inside — text only */}
    <div style={{padding:'56px 80px',borderTop:'1.5px solid #2a251f'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:60}}>
        <div className="h2">Что<br/>внутри</div>
        <div className="col" style={{gap:24}}>
          {[
            ['Презентация','PDF, 16–22 слайда. Структура: разогрев → теория → примеры → задачи на отработку.'],
            ['Рабочий лист','A4. Можно распечатать на класс. Watermark с вашим email — невидимый.'],
            ['Ответы','Отдельный файл. Только для учителя.'],
          ].map(([t,d],i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'40px 1fr',gap:16,paddingBottom:18,borderBottom:'1px solid #d4d0c4'}}>
              <div className="mono" style={{fontSize:18,fontFamily:'Caveat',color:'#3D5A40',fontWeight:700}}>0{i+1}</div>
              <div>
                <div className="h3">{t}</div>
                <div className="body" style={{marginTop:4,color:'#5a5048'}}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* How — minimal numbered list */}
    <div style={{padding:'56px 80px',background:'#f6f3ec',borderTop:'1.5px solid #2a251f'}}>
      <div className="h2" style={{marginBottom:24}}>Как работает</div>
      <div className="row" style={{gap:40,maxWidth:900}}>
        {['Зарегистрировались','Выбрали урок','Скачали и провели'].map((t,i)=>(
          <div key={i} style={{flex:1}}>
            <div className="mono" style={{fontSize:11,color:'#8a8278'}}>шаг {i+1}</div>
            <div className="h3" style={{marginTop:4}}>{t}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Pricing — tabular */}
    <div style={{padding:'72px 80px'}}>
      <div className="h2" style={{marginBottom:24}}>Тарифы</div>
      <div className="box" style={{maxWidth:800,padding:0,overflow:'hidden'}}>
        {[
          ['Месяц','590 ₽','в месяц','',false],
          ['Квартал','1 490 ₽','за 3 месяца','−16%',false],
          ['Год','4 990 ₽','за 12 месяцев','лучшая цена · −30%',true],
        ].map(([t,p,u,b,f],i)=>(
          <div key={i} style={{
            display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:16,padding:'20px 24px',
            borderBottom: i<2?'1px solid #d4d0c4':'none',
            background: f?'#d9e2d8':'transparent',alignItems:'center'
          }}>
            <div className="h3">{t}</div>
            <div className="h3" style={{color:'#3D5A40'}}>{p}</div>
            <div className="body" style={{color:'#5a5048'}}>{u} {b && <span className="chip" style={{marginLeft:6}}>{b}</span>}</div>
            <div className="btn sm primary">Выбрать</div>
          </div>
        ))}
      </div>
    </div>

    {/* FAQ */}
    <div style={{padding:'56px 80px',borderTop:'1.5px solid #2a251f'}}>
      <div className="h2" style={{marginBottom:18}}>Вопросы</div>
      <div className="col" style={{maxWidth:760}}>
        {['Как происходит оплата','Можно ли вернуть деньги','Подходит ли учебникам',
          'Что после отмены','Можно ли редактировать','Контрольные работы есть'].map((q,i)=>(
          <div key={i} style={{padding:'14px 0',borderBottom:'1px solid #d4d0c4',display:'flex',justifyContent:'space-between'}}>
            <div className="body">{q}</div><div className="mono">+</div>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);

// ---------- LANDING V3: utility-first / catalog-forward ----------
const LandingV3 = () => (
  <div className="wf scroll">
    <Nav />

    <div style={{padding:'48px 64px 24px',position:'relative'}}>
      <div className="row" style={{justifyContent:'space-between',alignItems:'flex-end',gap:48}}>
        <div style={{flex:'1 1 0'}}>
          <div className="h1" style={{fontSize:42}}>Готовые уроки. От учителя — учителю.</div>
          <div className="body" style={{color:'#5a5048',marginTop:14,maxWidth:520}}>
            Каталог из 42 уроков. Презентация + рабочий лист. 590 ₽/мес.
          </div>
        </div>
        <div className="row" style={{gap:10,flexShrink:0}}>
          <div className="btn primary">7 дней бесплатно</div>
          <div className="btn ghost">Каталог</div>
        </div>
      </div>
      <div className="note" style={{right:20,top:0}}>
        <span className="arrow">↙</span>
        нет hero-картинки —<br/>сразу к делу
      </div>
    </div>

    {/* Catalog teaser — actual table of recent lessons */}
    <div style={{padding:'24px 64px 48px'}}>
      <div className="row" style={{justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div className="label">недавно добавлено</div>
        <div className="mono" style={{fontSize:11,color:'#8a8278'}}>см. все 42 →</div>
      </div>
      <div className="box" style={{padding:0}}>
        {[
          ['Теорема Виета','8 класс · алгебра','45 мин','12 слайдов'],
          ['Производная функции','10 класс · алгебра','44 мин','18 слайдов'],
          ['Циклы while','9 класс · информатика','40 мин','14 слайдов'],
          ['Логарифмическое уравнение','11 класс · алгебра','45 мин','16 слайдов'],
          ['Массивы. Сортировка','10 класс · информатика','45 мин','20 слайдов'],
        ].map((r,i)=>(
          <div key={i} style={{
            display:'grid',gridTemplateColumns:'40px 1fr 1fr 100px 100px',gap:14,padding:'12px 18px',
            borderBottom: i<4?'1px solid #d4d0c4':'none',alignItems:'center'
          }}>
            <div className="ph" style={{width:32,height:24,fontSize:8,padding:0}}></div>
            <div className="body" style={{fontWeight:600}}>{r[0]}</div>
            <div className="mono" style={{fontSize:11,color:'#5a5048'}}>{r[1]}</div>
            <div className="mono" style={{fontSize:11,color:'#8a8278'}}>{r[2]}</div>
            <div className="mono" style={{fontSize:11,color:'#8a8278'}}>{r[3]}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Three-column inline */}
    <div style={{padding:'48px 64px',borderTop:'1.5px solid #2a251f',background:'#f6f3ec'}}>
      <div className="row" style={{gap:48}}>
        {[
          ['Презентации','PDF, готов к показу с проектора'],
          ['Рабочие листы','A4. Распечатать на класс'],
          ['Ответы','Отдельный файл для учителя'],
        ].map(([t,d],i)=>(
          <div key={i} style={{flex:1}}>
            <div className="h3">{t}</div>
            <div className="body" style={{color:'#5a5048',marginTop:6}}>{d}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Pricing — inline single line */}
    <div style={{padding:'48px 64px'}}>
      <div className="row" style={{alignItems:'flex-end',gap:48,justifyContent:'space-between'}}>
        <div>
          <div className="h2">590 ₽ в месяц.</div>
          <div className="body" style={{color:'#5a5048',marginTop:8}}>Или 4 990 ₽ в год — это −30%. Можно отменить в любой момент.</div>
        </div>
        <div className="row" style={{gap:10}}>
          <div className="btn ghost">Все тарифы</div>
          <div className="btn primary">Начать пробу</div>
        </div>
      </div>
    </div>

    {/* FAQ short */}
    <div style={{padding:'24px 64px 56px',borderTop:'1.5px solid #2a251f'}}>
      <div className="h2" style={{marginBottom:18}}>Вопросы</div>
      {['Оплата','Возврат','Учебники','Редактирование','Контрольные'].map((q,i)=>(
        <div key={i} style={{padding:'12px 0',borderBottom:'1px solid #d4d0c4',display:'flex',justifyContent:'space-between'}}>
          <div className="body">{q}</div><div className="mono">+</div>
        </div>
      ))}
    </div>

    <Footer />
  </div>
);

window.LandingV1 = LandingV1;
window.LandingV2 = LandingV2;
window.LandingV3 = LandingV3;
window.WireNav = Nav;
window.WireFooter = Footer;
