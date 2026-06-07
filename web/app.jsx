// App.jsx — composes all screens onto a DesignCanvas with Tweaks panel

const { DesignCanvas, DCSection, DCArtboard, DCNote } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect } = window;

const App = () => {
  const t = useTweaks(/*EDITMODE-BEGIN*/{
    "annotations": true,
    "accent": "green",
    "density": "airy"
  }/*EDITMODE-END*/);

  // Apply notes toggle to body
  React.useEffect(() => {
    document.body.classList.toggle('no-notes', !t.annotations);
  }, [t.annotations]);

  // Apply accent override
  React.useEffect(() => {
    const accentMap = { green: '#3D5A40', indigo: '#3F4D9C', graphite: '#2A2A2A' };
    const color = accentMap[t.accent] || '#3D5A40';
    let el = document.getElementById('__accent_override');
    if (!el) {
      el = document.createElement('style');
      el.id = '__accent_override';
      document.head.appendChild(el);
    }
    el.textContent = `
      .wf { --accent: ${color}; }
      .wf .btn.primary { background: ${color}; border-color: ${color}; }
      .wf .box.fill-accent { background: ${color}22; border-color: ${color}; }
      .wf .chip.accent { background: ${color}22; border-color: ${color}; }
    `;
  }, [t.accent]);

  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="landing" title="Лендинг" subtitle="3 направления — классика, редакторская, утилитарная">
          <DCArtboard id="land-v1" label="V1 · Классика" width={1200} height={2400}>
            <window.LandingV1 />
          </DCArtboard>
          <DCArtboard id="land-v2" label="V2 · Редакторская" width={1200} height={2200}>
            <window.LandingV2 />
          </DCArtboard>
          <DCArtboard id="land-v3" label="V3 · Утилитарная" width={1200} height={1700}>
            <window.LandingV3 />
          </DCArtboard>
        </DCSection>

        <DCSection id="catalog" title="Каталог" subtitle="Расположение фильтров и плотность сетки">
          <DCArtboard id="cat-v1" label="V1 · Sidebar 250px" width={1200} height={1100}>
            <window.CatalogV1 />
          </DCArtboard>
          <DCArtboard id="cat-v2" label="V2 · Pill row сверху" width={1200} height={1000}>
            <window.CatalogV2 />
          </DCArtboard>
          <DCArtboard id="cat-v3" label="V3 · Свёрнутый рейл + группировка" width={1200} height={1300}>
            <window.CatalogV3 />
          </DCArtboard>
        </DCSection>

        <DCSection id="lesson" title="Карточка урока" subtitle="Как показывать превью PDF">
          <DCArtboard id="les-v1" label="V1 · Превью слева, мета справа" width={1200} height={900}>
            <window.LessonV1 />
          </DCArtboard>
          <DCArtboard id="les-v2" label="V2 · Full-bleed превью" width={1200} height={900}>
            <window.LessonV2 />
          </DCArtboard>
          <DCArtboard id="les-v3" label="V3 · Лента миниатюр" width={1200} height={700}>
            <window.LessonV3 />
          </DCArtboard>
        </DCSection>

        <DCSection id="pricing" title="Тарифы" subtitle="Как выделить «Год»">
          <DCArtboard id="pri-v1" label="V1 · Масштаб + рамка" width={1200} height={900}>
            <window.PricingV1 />
          </DCArtboard>
          <DCArtboard id="pri-v2" label="V2 · Таблица, фон строки" width={1200} height={800}>
            <window.PricingV2 />
          </DCArtboard>
          <DCArtboard id="pri-v3" label="V3 · Один тариф + переключатель" width={1200} height={900}>
            <window.PricingV3 />
          </DCArtboard>
        </DCSection>

        <DCSection id="account" title="Личный кабинет">
          <DCArtboard id="acc-v1" label="V1 · Sidebar (как в брифе)" width={1200} height={800}>
            <window.AccountV1 />
          </DCArtboard>
          <DCArtboard id="acc-v2" label="V2 · Без sidebar, карточки" width={1200} height={900}>
            <window.AccountV2 />
          </DCArtboard>
        </DCSection>

        <DCSection id="mobile" title="Мобильная версия">
          <DCArtboard id="mob-land" label="Лендинг · iPhone" width={390} height={1400}>
            <window.MobileLanding />
          </DCArtboard>
          <DCArtboard id="mob-cat" label="Каталог + bottom sheet" width={390} height={780}>
            <window.MobileCatalog />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Аннотации">
          <TweakToggle label="Подписи дизайнера" tweakKey="annotations" t={t} />
        </TweakSection>
        <TweakSection title="Акцент">
          <TweakRadio
            tweakKey="accent" t={t}
            options={[
              { value: 'green', label: 'Зелёный' },
              { value: 'indigo', label: 'Индиго' },
              { value: 'graphite', label: 'Графит' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
