import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { DbManagerProvider } from '../../providers/db-manager/db-manager';

/**
 * Generated class for the ServiceOutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service-out',
  templateUrl: 'service-out.html'
})
export class ServiceOutPage {

  @ViewChild('input_pw') input_pw;

  sessionId: string;
  loginPw: string;
  btnDisabled: boolean;
  pwConfirm: boolean;

  constructor(public platform: Platform, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public httpServiceProvider: HttpServiceProvider, 
              public DbManager: DbManagerProvider,
              public dialogs: Dialogs) {
    // this.sessionId = navParams.get('sessionId');
    this.DbManager.getData('sessionId').then(data => {
      this.sessionId = data;
      this.httpServiceProvider.setSessionId(this.sessionId);
      this.loginPw = '';
      this.btnDisabled = true;
      this.pwConfirm = true;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceOutPage');
  }

  serviceOut(){
    if(this.loginPw != null){
      //자리수가 안맞는지
      if(this.loginPw.length < 10){
        this.pwConfirm = false;
        this.input_pw.setFocus();
        return;
      }
      //영문과 숫자만 사용한게 맞는지
      // if(){

      // }

      //validate check 통과시
      if(!this.platform.is('core') && !this.platform.is('mobileweb')){
        if(this.dialogs.confirm('회원 탈퇴하시면 보유하신 포인트/스탬프/캐시가 초기화됩니다.','회원 탈퇴')){
          this.dialogs.alert('개발중');
          return;
        }
      }else{
        if(confirm('회원 탈퇴하시면 보유하신 포인트/스탬프/캐시가 초기화됩니다.')){
          //탈퇴처리
          this.httpServiceProvider.ServiceClose('http://110.45.199.181/api/setting/ServiceClose',this.loginPw).subscribe(data => {
            console.log('=========================================================');
            console.log('=========================================================');
            console.log('=========================================================');
            console.log('=========================================================');
            console.log('=========================================================');
            console.log('=========================================================');
            console.log('안심 비밀번호 변경 성공여부 : '+JSON.stringify(data));

            if(data['RESULT_CODE'] != null && data['RESULT_CODE'] == '0'){
              if(!this.platform.is('core') && !this.platform.is('mobileweb')){
                this.dialogs.alert('회원 탈퇴가 완료되었습니다.','회원 탈퇴');
                //초기화면 이동해야함
              }else{
                alert('회원 탈퇴가 완료되었습니다.');
              }
            }else{
              if(!this.platform.is('core') && !this.platform.is('mobileweb')){
                this.dialogs.alert('오류발생');
              }else{
                alert('오류발생');
              }
            }
          });
          
        }
      }
      
    }
  }

  inputChange(){
    if(this.loginPw.length > 0){
      this.btnDisabled = false;
    }else{
      this.btnDisabled = true;
    }
  }

}
