import DefaultTheme from 'vitepress/theme';
import Home from './components/Home.vue';
import Catalog from './components/Catalog.vue';
import Contracts from './components/Contracts.vue';
import SourceNote from './components/SourceNote.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    router.onAfterRouteChanged = () => {
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('logic:navigate'));
    };
    app.component('LogicHome', Home);
    app.component('ModuleCatalog', Catalog);
    app.component('ContractCatalog', Contracts);
    app.component('SourceNote', SourceNote);
  }
};
