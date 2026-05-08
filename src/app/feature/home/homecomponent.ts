import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ImageUploadService } from '../../core/services/image-upload.service';
import { Image, User } from '../../core/models/user.interface';
import { NgImageSliderComponent } from 'ng-image-slider';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChartOptions, ChartType } from 'chart.js';
import { DonationService } from '../../core/services/donationservice';
import * as Highcharts from 'highcharts';
import 'highcharts/highcharts-3d'; // Direct side-effect import



@Component({
  selector: 'app-homecomponent',
  standalone: false,
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class Homecomponent implements AfterViewInit {

  @ViewChild('nav') slider!: NgImageSliderComponent;

  //uploadedList: any[] = [];

 // imageObject: Array<object> = [];
  userProfile!: User | null;

  // Base path for images in the assets folder for 
  // ng-image-slider if we want to switch to that, for now we are using swiperjs for the slider
  imageDataWhenNoImgInDb = [
    '../../../assets/images/image.png',
    '../../../assets/images/image1.png',
    '../../../assets/images/image2.png',
  ];


  // Base path for images in the assets folder for swipper
  images = [
  'assets/images/image.png',
  'assets/images/image1.png',
  'assets/images/image2.png'
];

  constructor(private uploadService: ImageUploadService, private cdr: ChangeDetectorRef, 
    private authService: AuthService, private donationService: DonationService) { }
  
  ngAfterViewInit(): void {
    // this will be used for ng-image-slider if we want to switch to that, for now we are using swiperjs for the slider
     //this.loadUploadedImages();
     //this.swipperConfig();
     this.loadImages();
     //this.loadYearly();
    
  }
  
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
      }
    },

    title: {
      text: 'Donation Distribution by Category'
    },

    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b> (${point.y})'
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%'
        }
      }
    },

    series: [{
      type: 'pie',
      name: 'Donations',
      data: [
        { name: 'Education', y: 50000 },
        { name: 'Health', y: 30000 },
        { name: 'Livelihood', y: 20000 },
        { name: 'Emergency Relief', y: 15000 }
      ]
    }]
  };

  async loadImages() {
    this.userProfile = this.authService.currentUserValue;
   // await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('User profile in Homecomponent:', this.userProfile);

    this.uploadService.getUploadedImages().subscribe({
      next: (list: Image[]) => {

        console.log('Uploaded images list:', list.length);

        if (list.length === 0) {
          this.images = [...this.imageDataWhenNoImgInDb];
        } else {
          this.images = list.map(it => 'data:image/jpeg;base64,' + it.imageData);
          console.log('Images loaded from DB:', this.images);
        }
        this.cdr.detectChanges();
      },
      error: () => { }
    });
  }

  //   swipperConfig(): Swiper {
  //   return new Swiper('.mySwiper', {
  //     slidesPerView: 1,
  //     spaceBetween: 30,
  //     //slidesPerGroup: 1,
  //    modules: [Navigation, Pagination, Autoplay],
  //    navigation: {
  //       nextEl: '.swiper-button-next',
  //       prevEl: '.swiper-button-prev',
  //     },
  //      pagination: {
  //       el: '.swiper-pagination',
  //       clickable: true
  //     },
  //     autoplay: { delay: 2000, disableOnInteraction: false },
  //     loop: true,
  //   });
  // }

  // async loadUploadedImages() {
  //   this.userProfile = this.authService.currentUserValue;
  // await new Promise(resolve => setTimeout(resolve, 1000));
  //   console.log('User profile in Homecomponent:', this.userProfile);
  //   this.uploadService.getUploadedImages().subscribe({
  //     next: (list: Image[]) => {

  //       /* this can be used with ng-image-slider if we want to switch to that */
  //       //this.uploadedList = Array.isArray(list) ? list : [];
  //       console.log('Uploaded images list:', list.length);

  //       if (list.length === 0) {
  //         this.imageDataWhenNoImgInDb.forEach((item, index) => {
  //           console.log(`Item at ${index}:`, item);
  //           this.imageObject.push({
  //             image: item,
  //             thumbImage: item,
  //             alt: 'Default Image',
  //             title: 'No images uploaded yet'
  //           });

  //         });
  //       } else {
  //         this.imageObject = list.map(it => ({
  //           image: 'data:image/jpeg;base64,' + it.imageData,
  //           thumbImage: 'data:image/jpeg;base64,' + it.imageData,
  //           alt: it.name,
  //           title: it.description
  //         }));
  //       }
  //       this.cdr.detectChanges();
  //       //console.log('loadUploadedImages called' + this.uploadedList.length + ' items');
  //     },
  //     error: () => { }
  //   });
  //   //console.log('loadUploadedImages called' + this.uploadedList.length + ' items');
  // }

  
  // prevImageClick() {
  //       this.slider.prev();
  //   }

  //   nextImageClick() {
  //       this.slider.next();
  //   }

  //   pushImages = async () => {
  //   var response = await randomImageJs.getWallpapers({ get: 50 });
  //   console.log(response);

  //   response.forEach((image) => {
  //     var obj = {
  //       image: image.image,
  //       thumbImage: image.thumbnail,
  //       alt: image.title,
  //       title: image.title
  //     };

  //     this.imageObject.push(obj);
  //   });
  // };
}
