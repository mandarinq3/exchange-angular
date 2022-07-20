import {Component,ViewChild,AfterViewInit,ElementRef,Renderer2} from '@angular/core'

@Component({
    selector:'app-main',
    templateUrl:'./main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements AfterViewInit{
    constructor(private renderer: Renderer2) {

    }

    rates:object;
    
    @ViewChild('payForm') payForm!: ElementRef<HTMLInputElement>;
    @ViewChild('getForm') getForm!: ElementRef<HTMLInputElement>;
    @ViewChild('payInp') payInp!: ElementRef<HTMLInputElement>;
    @ViewChild('getInp') getInp!: ElementRef<HTMLInputElement>;
    @ViewChild('paySelect') paySelect!: ElementRef<HTMLInputElement>;
    @ViewChild('getSelect') getSelect!: ElementRef<HTMLInputElement>;
    @ViewChild('getClearBtn') getClearBtn!: ElementRef<HTMLInputElement>;
    @ViewChild('payClearBtn') payClearBtn!: ElementRef<HTMLInputElement>;
    @ViewChild('mainLoader') mainLoader!: ElementRef<HTMLElement>;
    @ViewChild('mainImgCntainer') mainImgCntainer!: ElementRef<HTMLElement>;


    clear='clear';
    payPlaceholder='UAH';
    getPlaceholder='USD';
    payCurrencyPic='./assets/UAH.png';
    getCurrencyPic='./assets/USD.png';
    payInputVal='';
    getInputVal='';
    isSwaped=false;
    hasResponse=false;
    payWith='UAH';
    getWith='USD';

    ngAfterViewInit() { 
        
        fetch("https://api.fastforex.io//fetch-multi?from=UAH&to=EUR,USD,UAH&api_key=489d29ef3e-0d1c851dc4-rf4e9m")
        .then((res)=>{return res.json()})
        .then((result) => {           
            this.rates=result.results  
            this.renderer.setStyle(this.mainImgCntainer.nativeElement, 'display', 'block'); 
            this.renderer.setStyle(this.mainLoader.nativeElement, 'display', 'none');   
        })
        .catch(error => console.log('error', error));
    }

    swapForms(){
            if(this.isSwaped){
                this.renderer.setStyle(this.payForm.nativeElement, 'top', '200px');
                this.renderer.setStyle(this.getForm.nativeElement, 'top', '335px');
            }else{
                this.renderer.setStyle(this.payForm.nativeElement, 'top', '335px');
                this.renderer.setStyle(this.getForm.nativeElement, 'top', '200px');
            }
            this.isSwaped=!this.isSwaped  
    }

    payInputHandler(event:any){
        if(event.target.value!=''){
            this.renderer.setStyle(this.getClearBtn.nativeElement, 'display', 'block');
            this.renderer.setStyle(this.payClearBtn.nativeElement, 'display', 'block');
        }else{
            this.renderer.setStyle(this.getClearBtn.nativeElement, 'display', 'none');
            this.renderer.setStyle(this.payClearBtn.nativeElement, 'display', 'none');
        }
        let amount = event.target.value;
        let payRate!:number;
        let getRate!:number;
        for (const [key, value] of Object.entries(this.rates)) {
            if(this.payWith==key){
                payRate=value; 
            }
        }
        for (const [key, value] of Object.entries(this.rates)) {
            if(this.getWith==key){
                getRate=value; 
            }
        }
        let result=amount/payRate*getRate;
        this.getInp.nativeElement.value=result+'';
    }

    getInputHandler(event:any){
        if(event.target.value!=''){
            this.renderer.setStyle(this.getClearBtn.nativeElement, 'display', 'block');
            this.renderer.setStyle(this.payClearBtn.nativeElement, 'display', 'block');
        }else{
            this.renderer.setStyle(this.getClearBtn.nativeElement, 'display', 'none');
            this.renderer.setStyle(this.payClearBtn.nativeElement, 'display', 'none');
        }

        let amount = event.target.value;
        let payRate!:number;
        let getRate!:number;

        for (const [key, value] of Object.entries(this.rates)) {
            if(this.payWith==key){
                payRate=value; 
            }
        }
        for (const [key, value] of Object.entries(this.rates)) {
            if(this.getWith==key){
                getRate=value; 
            }
        }
        let result=amount/payRate*getRate;
        this.payInp.nativeElement.value=result+'';

    }

    selectHandlerPay(event:any){
        this.payPlaceholder=event.target.value;
        this.payCurrencyPic=`./assets/${event.target.value}.png`;
        this.payWith=event.target.value;
        this.clearInput(event);  
    }

    selectHandlerGet(event:any){
        this.getPlaceholder=event.target.value;
        this.getCurrencyPic=`./assets/${event.target.value}.png`;
        this.getWith=event.target.value;
        this.clearInput(event);
    }

    clearInput(event:any){
        event.preventDefault();   
        this.payInp.nativeElement.value=' ';
        this.getInp.nativeElement.value=' ';
        this.renderer.setStyle(this.getClearBtn.nativeElement, 'display', 'none');
        this.renderer.setStyle(this.payClearBtn.nativeElement, 'display', 'none');
        event.target.dataset.id=='payInp' ? this.payInp.nativeElement.focus() : this.getInp.nativeElement.focus()
    }
}