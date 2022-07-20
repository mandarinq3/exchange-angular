import {Component,ViewChild,ElementRef, Renderer2} from '@angular/core';


@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    logoUrl='./assets/trident.png'
    eurUrl='./assets/EUR.png'
    usdUrl='./assets/USD.png'

    rates:object;

    EUR:number;
    USD:number;

    @ViewChild('eurLoader') eurLoader!: ElementRef<HTMLElement>;
    @ViewChild('usdLoader') usdLoader!: ElementRef<HTMLElement>;

    constructor(private renderer: Renderer2) {}
    ngAfterViewInit() {
        fetch("https://api.fastforex.io//fetch-multi?from=UAH&to=EUR,USD,UAH&api_key=489d29ef3e-0d1c851dc4-rf4e9m")
        .then((res)=>{return res.json()})
        .then((result) => {           
            this.rates=result.results ;
             let eur=1/result.results.EUR*1;
             let usd=1/result.results.USD*1;
             this.EUR=+eur.toFixed(2);
             this.USD=+usd.toFixed(2);
             this.renderer.setStyle(this.eurLoader.nativeElement, 'display', 'none');
             this.renderer.setStyle(this.usdLoader.nativeElement, 'display', 'none');
             
        })
        .catch(error => console.log('error', error));
    }
}
