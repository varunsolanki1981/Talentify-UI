import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';
import { register } from 'swiper/element/bundle';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

platformBrowser().bootstrapModule(AppModule, {

})
  .catch(err => console.error(err));

ModuleRegistry.registerModules([
  AllCommunityModule, // or AllEnterpriseModule
]);


register();
