// Catalog page wireframes
// V1: classic — left sidebar filters, 3-col grid
// V2: top filters — pill row on top, denser 4-col grid
// V3: collapsible rail + grouped-by-topic editorial layout

const CatalogCard = ({ title='Теорема Виета', grade='8 класс', subj='алгебра', dur='45 мин', size='lg' }) => {
  const w = size==='sm'?180:240;
  return (
    <div className="col" style={{gap:8}}>
      <div className="ph" style={{aspectRatio:'1/1',width:'100%'}}>превью<br/>1-го слайда</div>
      <div className="body" style={{fontWeight:600,fontSize:size==='sm'?13:14}}>{title}</div>
      <div className="row" style={{gap:6,flexWrap:'wrap'}}>
        <div className="chip">{grade}</div>
        <div className="chip">{subj}</div>
        <div className="chip" style={{opacity:0.7}}>{dur}</div>
      </div>
    </div>
  );
};

const FilterGroup = ({ title, items, multi=true }) => (
  <div style={{marginBottom:18}}>
    <div className="label" style={{marginBottom:8}}>{title}</div>
    <div className="col" style={{gap:5}}>
      {items.map((it,i)=>(
        <div key={i} className="row" style={{gap:8,alignItems:'center'}}>
          <div className="box" style={{width:13,height:13,borderRadius:multi?3:99,background:i===0?'#3D5A40':'#fdfcf8'}}/>
          <div className="body" style={{fontSize:13}}>{it}</div>
        </div>
      ))}
    </div>
  </div>
);

const CatalogV1 = () => (
  <div className="wf scroll">
    <window.WireNav active="cat" />
    <div style={{padding:'24px 40px 16px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
      <div className="h2">Каталог · <span style={{color:'#8a8278'}}>42 урока</span></div>
      <div className="mono" style={{fontSize:11}}>сортировка: новые ↓</div>
    </div>
    <div style={{padding:'0 40px 56px',display:'grid',gridTemplateColumns:'250px 1fr',gap:32,position:'relative'}}>
      {/* Sidebar */}
      <div style={{borderRight:'1.5px solid #2a251f',paddingRight:20}}>
        <FilterGroup title="Класс" items={['8 класс','9 класс','10 класс','11 класс']}/>
        <FilterGroup title="Предмет" items={['Алгебра','Геометрия','Информатика']}/>
        <div style={{marginBottom:18}}>
          <div className="label" style={{marginBottom:8}}>Тема</div>
          {/* tree */}
          <div className="col" style={{gap:6,fontSize:13}}>
            <div>▾ Функции</div>
            <div style={{paddingLeft:14,opacity:0.85}}>· Линейная</div>
            <div style={{paddingLeft:14,opacity:0.85}}>· Квадратичная</div>
            <div style={{paddingLeft:14,opacity:0.85}}>· Производная</div>
            <div>▸ Уравнения</div>
            <div>▸ Геометрия</div>
            <div>▸ Алгоритмы</div>
          </div>
        </div>
        <FilterGroup title="Тип урока" items={['Новая тема','Закрепление','Контрольная','Повторение']}/>
        <div className="note" style={{left:0,bottom:-30,position:'relative',marginTop:14}}>
          <span className="arrow">↑</span>
          250 px фильтры
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="row" style={{gap:8,marginBottom:18,flexWrap:'wrap'}}>
          <div className="chip accent">8 класс ×</div>
          <div className="chip accent">алгебра ×</div>
          <div className="mono" style={{fontSize:10,color:'#8a8278',alignSelf:'center'}}>сбросить</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24,rowGap:32}}>
          {Array.from({length:9}).map((_,i)=>(
            <CatalogCard key={i}
              title={['Теорема Виета','Квадратичная функция','Системы уравнений','Окружность','Треугольники','Циклы while','Линейная функция','Массивы','Дроби'][i]}
              grade={['8 класс','9','9','8','8','9','7','10','8'][i]+(i>0?' класс':'')}
              subj={i===5||i===7?'информатика':'алгебра'}
            />
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:32}}>
          <div className="btn ghost">Показать ещё 12</div>
        </div>
      </div>
    </div>
  </div>
);

const CatalogV2 = () => (
  <div className="wf scroll">
    <window.WireNav active="cat" />
    <div style={{padding:'24px 40px 12px'}}>
      <div className="h2">Каталог</div>
    </div>
    {/* Pill filter row */}
    <div style={{padding:'8px 40px 18px',borderBottom:'1.5px solid #2a251f',position:'relative'}}>
      <div className="row" style={{gap:8,flexWrap:'wrap',alignItems:'center'}}>
        <div className="mono" style={{fontSize:10,color:'#8a8278'}}>класс:</div>
        {['все','8','9','10','11'].map((c,i)=>(
          <div key={i} className={`chip ${i===2?'accent':''}`}>{c}</div>
        ))}
        <div style={{width:1,height:18,background:'#d4d0c4',margin:'0 6px'}}/>
        <div className="mono" style={{fontSize:10,color:'#8a8278'}}>предмет:</div>
        {['алгебра','геометрия','информатика'].map((c,i)=>(
          <div key={i} className={`chip ${i===0?'accent':''}`}>{c}</div>
        ))}
        <div style={{width:1,height:18,background:'#d4d0c4',margin:'0 6px'}}/>
        <div className="mono" style={{fontSize:10,color:'#8a8278'}}>тип:</div>
        {['новая тема','закрепление','контрольная'].map((c,i)=>(
          <div key={i} className="chip">{c}</div>
        ))}
      </div>
      <div className="note" style={{right:30,top:-10}}>
        <span className="arrow">↓</span>
        фильтры в одну строку,<br/>больше места под сетку
      </div>
    </div>
    {/* 4-col grid */}
    <div style={{padding:'24px 40px 56px'}}>
      <div className="row" style={{justifyContent:'space-between',marginBottom:14}}>
        <div className="mono" style={{fontSize:11,color:'#8a8278'}}>9 класс · алгебра — 14 уроков</div>
        <div className="mono" style={{fontSize:11}}>сортировка: новые ↓</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:18,rowGap:28}}>
        {Array.from({length:12}).map((_,i)=>(
          <CatalogCard key={i} size="sm"
            title={['Квадратное уравнение','Дискриминант','Теорема Виета','Системы','Парабола','Неравенства','Прогрессия','Корни','Степень','Графики','Модули','Тригонометрия'][i]}
          />
        ))}
      </div>
    </div>
  </div>
);

const CatalogV3 = () => (
  <div className="wf scroll">
    <window.WireNav active="cat" />
    <div style={{padding:'24px 40px 12px',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
      <div className="h2">Каталог</div>
      <div className="mono" style={{fontSize:11}}>группировать по: темам ▾</div>
    </div>
    <div style={{padding:'0 40px 40px',display:'grid',gridTemplateColumns:'40px 1fr',gap:24,position:'relative'}}>
      {/* Collapsed rail */}
      <div className="col" style={{gap:14,paddingTop:18,alignItems:'center',borderRight:'1.5px solid #2a251f'}}>
        {['8','9','10','11','▼','М','И','▼','★'].map((c,i)=>(
          <div key={i} className="box" style={{width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontFamily:'JetBrains Mono'}}>{c}</div>
        ))}
        <div className="note" style={{left:30,top:0}}>
          <span className="arrow">←</span>
          свёрнутый рейл,<br/>раскрывается по клику
        </div>
      </div>

      {/* Grouped lessons */}
      <div className="col" style={{gap:36,paddingTop:18}}>
        {[
          ['Функции','7 уроков'],
          ['Уравнения','9 уроков'],
          ['Алгоритмы и циклы','5 уроков'],
        ].map(([title,count],g)=>(
          <div key={g}>
            <div className="row" style={{justifyContent:'space-between',alignItems:'baseline',marginBottom:14,paddingBottom:6,borderBottom:'1px solid #2a251f'}}>
              <div className="h3">{title}</div>
              <div className="mono" style={{fontSize:11,color:'#8a8278'}}>{count} · все →</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24}}>
              {Array.from({length:3}).map((_,i)=>(
                <CatalogCard key={i}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

window.CatalogV1 = CatalogV1;
window.CatalogV2 = CatalogV2;
window.CatalogV3 = CatalogV3;
