import { Component } from '@angular/core';
import {  FormBuilder,  Validators} from '@angular/forms';
//import { DropdownModule, PaginationModule ,AccordionModule } from 'ng2-bootstrap';
import { SnmpDeviceService } from './snmpdevicecfg.service';
import {ControlMessages} from './control-messages.component';





@Component({
  selector: 'snmpdevs',
  providers: [SnmpDeviceService],
  templateUrl: '/public/home/snmpdeviceeditor.html',
  styleUrls:['public/home/snmpdeviceeditor.css'],
  //bindings: [SnmpDeviceService],
  //viewBindings: [FORM_BINDINGS],
  //directives: [FormBuilder,Validators,DropdownModule, PaginationModule ,AccordionModule,ControlMessages]
})

export class SnmpDeviceCfgComponent {
  public oneAtATime:boolean = true;
  editmode: string; //list , create, modify
  snmpdevs: Array<any>;
  filter: string;
  snmpdevForm: any;

  reloadData(){
  // now it's a simple subscription to the observable
    this.snmpDeviceService.getDevices(this.filter)
      .subscribe(data => { this.snmpdevs = data },
		  err => console.error(err),
		  () => console.log('SNMPDEV DONE')
		      );

  }
  constructor(public snmpDeviceService: SnmpDeviceService,builder: FormBuilder) {
	  this.editmode='list';
	  this.reloadData();
	  this.snmpdevForm = builder.group({
		id: ['',Validators.compose([Validators.required, Validators.minLength(4)])],
      		Host: ['', Validators.required],
		Port: [161,Validators.required],
		Retries: [],
		Timeout: [],
		SnmpVersion:['2c',Validators.required],
		Community: ['public'],
		V3SecLevel:[''],
		V3AuthUser:[''],
		V3AuthPass:[''],
		V3AuthProt:[''],
		V3PrivPass:[''],
		V3PrivProt:[''],
		Freq:[60,Validators.required],
		Config:[''],
		LogLevel:['info',Validators.required],
		SnmpDebug:['false',Validators.required],
		DeviceTagMame: ['tagname',Validators.required],
		DeviceTagValue: [''],
		Extratags:[''],
	});
    }
  onFilter(){
	this.reloadData();
  }

 viewItem(id,event){
	console.log('view',id);
 }
 removeItem(id,event){
	console.log('remove',id);
 }
 newDevice(){
	 this.editmode = "create";
 }
 cancelEdit(){
	 this.editmode = "list";
 }
 saveSnmpDev(){
	 if(this.snmpdevForm.dirty && this.snmpdevForm.valid) {

	console.log(this.snmpdevForm.value);
	var result=this.snmpDeviceService.addDevice(this.snmpdevForm.value);
	console.log(result);
	}
 }

}
