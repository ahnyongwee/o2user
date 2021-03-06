import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { HomePage } from '../../pages/home/home';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { TosDetailPage } from '../tos-detail/tos-detail';
import { AppVersion } from '@ionic-native/app-version';
import { Dialogs } from '@ionic-native/dialogs';
import { SafePasswordPage } from '../../pages/safe-password/safe-password';
import { CustomerDetailPage } from '../../pages/customer-detail/customer-detail';
import { ServiceOutPage } from '../../pages/service-out/service-out';
import { DbManagerProvider } from '../../providers/db-manager/db-manager';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  isPush: boolean = false;
  isMarketing: boolean = false;
  isLocation: boolean = false;
  location_tos_no: number;
  marketing_tos_no: number;
  push_tos_no: number;
  tosPushDetalUrl: string;
  tosMarketingDetalUrl: string;
  tosLocationDetalUrl: string;
  sessionId: string;
  TOSInfo: any;
  autoLogin: boolean;

  constructor(public platform: Platform,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public httpServiceProvider: HttpServiceProvider, 
              public DbManager: DbManagerProvider,
              private appVersion: AppVersion,
              public dialogs: Dialogs) {

    this.autoLogin = false; // 이거도 스토리지에서 관리해아함 storage
    // this.sessionId = navParams.get('sessionId');
    this.DbManager.getData('sessionId').then(data => {
      this.sessionId = data;
      this.httpServiceProvider.setSessionId(this.sessionId);
  
      //홈화면 이동시 다시 데이터 불러오거나 스토리지 써야되지만 지금 없으니 임시로 정책 조회
      this.httpServiceProvider.getTOSInfo('http://110.45.199.181/api/customer/TOSSearch').subscribe(data => {
      this.TOSInfo = data;
      console.log('=========================================================');
      console.log('=========================================================');
      console.log('=========================================================');
      console.log('=========================================================');
      console.log('=========================================================');
      console.log('=========================================================');
      console.log('고객 정책동의여부 조회 : '+JSON.stringify(this.TOSInfo));
  
        if(this.TOSInfo != null){
          let tosList: any[] = JSON.parse(JSON.stringify(this.TOSInfo['TOS_LIST']));
          for(let t of tosList){
            if(t.TYPE == 'O2P04'){
              this.location_tos_no = t.TOS_NO;
              this.tosLocationDetalUrl = t.TOS_URL;
              if(t.AGREE_YN == 'Y'){
                this.isLocation = true;
              }else{
                this.isLocation = false;
              }
            }
            if(t.TYPE == 'O2P05'){
              this.marketing_tos_no = t.TOS_NO;
              this.tosMarketingDetalUrl = t.TOS_URL;
              if(t.AGREE_YN == 'Y'){
                this.isMarketing = true;
              }else{
                this.isMarketing = false;
              }
            }
            if(t.TYPE == 'O2P06'){
              this.push_tos_no = t.TOS_NO;
              this.tosPushDetalUrl = t.TOS_URL;
              if(t.AGREE_YN == 'Y'){
                this.isPush = true;
              }else{
                this.isPush = false;
              }
            }
          }
        }
      });
    });
  }

  async getAppName(){
    const appName = await this.appVersion.getAppName();
    console.log(appName);
    this.dialogs.alert(appName);
  }

  async getPackageName() {
    const packageName = await this.appVersion.getPackageName();
    console.log(packageName);
    this.dialogs.alert(packageName);
  }

  async getVersionNumber() {
    const versionNumber = await this.appVersion.getVersionNumber();
    console.log(versionNumber);
    this.dialogs.alert(versionNumber);
  }

  async getVersionCode() {
    const versionCode = await this.appVersion.getVersionCode();
    console.log(versionCode);
    this.dialogs.alert(versionCode.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
    if(!this.platform.is('core') && !this.platform.is('mobileweb')){

      this.getAppName();
      this.getPackageName();
      this.getVersionCode();
      this.getVersionNumber();
    }
  }

  openHome() {
    this.navCtrl.setRoot(HomePage);
  }

  radioCheck(type,val){
    if(type == '1'){
      if(val == 'Y'){
        this.isPush = true;
      }else{
        this.isPush = false;
      }

      this.httpServiceProvider.setPushUse('http://110.45.199.181/api/setting/PushUse',val)
      .subscribe(data => {
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');

        console.log('PushUse : '+JSON.stringify(data));

        if(data['RES_CODE'] == '0'){
          console.log("성공");
        }
      });

    }else if(type == '2'){
      if(val == 'Y'){
        this.isMarketing = true;
      }else{
        this.isMarketing = false;
      }

      let tosList = [];
      tosList.push({"TOS_NO":this.marketing_tos_no.toString(),"AGREE_YN":val});
      
      this.httpServiceProvider.setTOSAgreement('http://110.45.199.181/api/customer/TOSAgreement',tosList)
      .subscribe(data => {
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');

        console.log('setTOSAgreement : '+JSON.stringify(data));

        if(data['RES_CODE'] == '0'){
          console.log("성공");
        }
      });
    }else if(type == '3'){
      if(val == 'Y'){
        this.isLocation = true;
      }else{
        this.isLocation = false;
      }
      console.log(this.location_tos_no);
      let tosList = [];
      tosList.push({"TOS_NO":this.location_tos_no.toString(),"AGREE_YN":val});
      
      this.httpServiceProvider.setTOSAgreement('http://110.45.199.181/api/customer/TOSAgreement',tosList)
      .subscribe(data => {
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');
        console.log('=========================================================');

        console.log('setTOSAgreement : '+JSON.stringify(data));

        if(data['RES_CODE'] == '0'){
          console.log("성공");
        }
      });
    }
  }

  TOSDetailInfo(type){
    let url = '';
    let title = '';

    if(type == '1'){
      url = this.tosPushDetalUrl;
      title = 'PUSH 알림';
    }else if(type == '2'){
      url = this.tosMarketingDetalUrl;
      title = '마케팅 활용동의';
    }else if(type == '3'){
      url = this.tosLocationDetalUrl;
      title = '위치정보 수집이용 동의';
    }
    this.navCtrl.push(TosDetailPage,{'url':'http://110.45.199.181'+url,'sessionId':this.sessionId, 'title':title});
  }

  goSafePasswordPage(){
    this.navCtrl.push(SafePasswordPage);
  }
  goCustomerDetailPage(){
    this.navCtrl.push(CustomerDetailPage);
  }

  goServiceOutPage(){
    this.navCtrl.push(ServiceOutPage);
  }

  checkToggle(){
    console.log(this.autoLogin);
  }

  logout(){
    if(!this.platform.is('core') && !this.platform.is('mobileweb')){
      if(this.dialogs.confirm('로그아웃 하시겠습니까','로그아웃')){
        this.dialogs.alert('개발중');
      }
    }else{
      if(confirm('로그아웃 하시겠습니까')){
        this.dialogs.alert('개발중');
      }
    }
  }

}
