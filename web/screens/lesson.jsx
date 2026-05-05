// Lesson detail wireframes
// V1: classic — preview left, meta right
// V2: full-bleed preview, meta below
// V3: split with inline slide thumbnails strip

const LessonV1 = () => (
  <div className="wf scroll">
    <window.WireNav />
    <div style={{padding:'18px 40px',borderBottom:'1px solid #d4d0c4'}}>
      <div className="mono" style={{fontSize:11,color:'#8a8278'}}>каталог / алгебра / 8 класс / —</div>
    </div>
    <div style={{padding:'32px 40px',display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:48,position:'relative'}}>
      {/* Preview */}
      <div>
        <div className="ph" style={{aspectRatio:'4/3',width:'100%'}}>
          PDF preview<br/>слайд 1 / 18
        </div>
        <div className="row" style={{justifyContent:'space-between',marginTop:14,alignItems:'center'}}>
          <div className="row" style={{gap:8}}>
            <div className="box" style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}}>←</div>
            <div className="box" style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}}>→</div>
          </div>
          <div className="mono" style={{fontSize:11}}>1 / 18</div>
          <div className="mono" style={{fontSize:11,color:'#8a8278'}}>увеличить ⤢</div>
        </div>
        <div className="note" style={{left:-10,top:-30}}>
          <span className="arrow">↙</span>
          можно листать слайды стрелками
        </div>
      </div>
      {/* Meta */}
      <div className="col" style={{gap:18}}>
        <div className="row" style={{gap:6}}>
          <div className="chip">8 класс</div>
          <div className="chip">алгебра</div>
          <div className="chip">новая тема</div>
        </div>
        <div className="h1" style={{fontSize:38}}>Теорема Виета</div>
        <div className="body" style={{color:'#5a5048'}}>
          Урок на 45 минут. Разбираем связь корней квадратного уравнения с его коэффициентами. Включает разогрев, доказательство, 6 примеров и задачи для закрепления.
        </div>
        <div className="box" style={{padding:18,marginTop:8}}>
          <div className="label" style={{marginBottom:10}}>что внутри</div>
          <div className="col" style={{gap:8}}>
            <div className="body">· Презентация — 18 слайдов</div>
            <div className="body">· Рабочий лист — A4, 1 страница</div>
            <div className="body">· Ответы к рабочему листу</div>
            <div className="body">· LaTeX исходник</div>
          </div>
        </div>
        <div className="btn primary" style={{alignSelf:'flex-start',marginTop:6}}>Скачать PDF</div>
        <div className="mono" style={{fontSize:10,color:'#8a8278'}}>watermark с вашим email · подписка активна до 12.05.2026</div>

        <div className="note" style={{right:0,top:120}}>
          <span className="arrow">↓</span>
          для гостя — кнопка<br/>«Оформить подписку»
        </div>
      </div>
    </div>
    {/* Related */}
    <div style={{padding:'40px',borderTop:'1.5px solid #2a251f'}}>
      <div className="label" style={{marginBottom:14}}>похожие уроки</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:18}}>
        {Array.from({length:4}).map((_,i)=><div key={i} className="ph" style={{aspectRatio:'4/3'}}>урок {i+1}</div>)}
      </div>
    </div>
  </div>
);

const LessonV2 = () => (
  <div className="wf scroll">
    <window.WireNav />
    {/* Full bleed preview */}
    <div style={{position:'relative',background:'#efece4',borderBottom:'1.5px solid #2a251f'}}>
      <div className="ph" style={{aspectRatio:'21/9',width:'100%',border:'none',borderRadius:0}}>
        большое превью<br/>слайд 1 из 18
      </div>
      <div style={{position:'absolute',left:24,bottom:24}}>
        <div className="row" style={{gap:8}}>
          <div className="box" style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',background:'#fdfcf8'}}>←</div>
          <div className="box" style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',background:'#fdfcf8'}}>→</div>
        </div>
      </div>
      <div className="mono" style={{position:'absolute',right:24,bottom:24,fontSize:11,background:'#fdfcf8',padding:'4px 8px',border:'1px solid #2a251f'}}>1 / 18</div>
    </div>

    {/* Sticky download bar */}
    <div style={{padding:'24px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #d4d0c4',position:'relative'}}>
      <div>
        <div className="row" style={{gap:6,marginBottom:6}}>
          <div className="chip">8 класс · алгебра</div>
          <div className="chip">45 мин</div>
        </div>
        <div className="h2">Теорема Виета</div>
      </div>
      <div className="btn primary">Скачать PDF</div>
      <div className="note" style={{right:200,top:-10}}>
        <span className="arrow">↓</span>
        sticky bar — скачать всегда видно
      </div>
    </div>

    {/* Body */}
    <div style={{padding:'32px 40px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:48}}>
      <div className="col" style={{gap:14}}>
        <div className="label">описание</div>
        <div className="body" style={{color:'#5a5048'}}>
          Урок на 45 минут. Разбираем связь корней квадратного уравнения с его коэффициентами. Включает разогрев, доказательство, 6 примеров и задачи для закрепления.
        </div>
        <div className="line w90" style={{marginTop:8}}/>
        <div className="line w80"/>
        <div className="line w70"/>
      </div>
      <div className="box" style={{padding:18,height:'fit-content'}}>
        <div className="label" style={{marginBottom:10}}>что внутри</div>
        <div className="col" style={{gap:6,fontSize:13}}>
          <div>· 18 слайдов PDF</div>
          <div>· рабочий лист A4</div>
          <div>· ответы для учителя</div>
          <div>· LaTeX исходник</div>
        </div>
      </div>
    </div>
  </div>
);

const LessonV3 = () => (
  <div className="wf scroll">
    <window.WireNav />
    <div style={{padding:'32px 40px',display:'grid',gridTemplateColumns:'80px 1fr 320px',gap:24,position:'relative'}}>
      {/* Vertical thumb strip */}
      <div className="col" style={{gap:8}}>
        {Array.from({length:7}).map((_,i)=>(
          <div key={i} className="ph" style={{aspectRatio:'4/3',padding:0,fontSize:9,
            border:i===0?'2px solid #3D5A40':'1.5px solid #2a251f'}}>{i+1}</div>
        ))}
        <div className="mono" style={{fontSize:9,textAlign:'center',color:'#8a8278'}}>+11</div>
      </div>
      <div className="note" style={{left:90,top:0,zIndex:6}}>
        <span className="arrow">←</span>
        миниатюры всех слайдов слева — можно прыгать к любому
      </div>

      {/* Big preview */}
      <div>
        <div className="ph" style={{aspectRatio:'4/3',width:'100%'}}>слайд 1 / 18</div>
        <div className="row" style={{justifyContent:'space-between',marginTop:10}}>
          <div className="mono" style={{fontSize:11}}>1 / 18</div>
          <div className="mono" style={{fontSize:11,color:'#8a8278'}}>↑↓ или клик по миниатюре</div>
        </div>
      </div>

      {/* Meta + sticky CTA */}
      <div className="col" style={{gap:14}}>
        <div className="row" style={{gap:6}}>
          <div className="chip">8 класс</div>
          <div className="chip">алгебра</div>
        </div>
        <div className="h2">Теорема Виета</div>
        <div className="body" style={{color:'#5a5048'}}>
          45 минут · 18 слайдов · рабочий лист A4. Разогрев → доказательство → примеры.
        </div>
        <div className="btn primary" style={{marginTop:6}}>Скачать PDF</div>
        <div className="line w80" style={{marginTop:8}}/>
        <div className="line w60"/>
        <div className="line w70"/>
      </div>
    </div>
  </div>
);

window.LessonV1 = LessonV1;
window.LessonV2 = LessonV2;
window.LessonV3 = LessonV3;
