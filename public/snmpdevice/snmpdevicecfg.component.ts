import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from '../common/multiselect-dropdown';
import { SnmpDeviceService } from '../snmpdevice/snmpdevicecfg.service';
import { InfluxServerService } from '../influxserver/influxservercfg.service';
import { MeasGroupService } from '../measgroup/measgroupcfg.service';
import { MeasFilterService } from '../measfilter/measfiltercfg.service';

import { GenericModal } from '../common/generic-modal';

@Component({
  selector: 'snmpdevs',
  providers: [SnmpDeviceService, InfluxServerService, MeasGroupService, MeasFilterService],
  templateUrl: 'public/snmpdevice/snmpdeviceeditor.html',
  styleUrls:['public/snmpdevice/snmpdeviceeditor.css']

})
export class SnmpDeviceCfgComponent {
  //TEST:
  @ViewChild('viewModal') public viewModal: GenericModal;

  //ADDED
    editmode: string; //list , create, modify
    snmpdevs: Array<any>;
    filter: string;
    snmpdevForm: any;
  	testsnmpdev: any;
  	influxservers: Array<any>;
    measfilters: Array<any>;
    measgroups: Array<any>;
  	filteroptions: any;
    selectgroups: IMultiSelectOption[];
  	selectfilters: IMultiSelectOption[];

    //Initialization data, rows, colunms for Table
    private data:Array<any> = [];
    public rows:Array<any> = [];
    public columns:Array<any> = [
    {title: 'ID', name: 'ID'},
    {title: 'Host', name: 'Host'},
    {title: 'Port', name: 'Port'},
    {title: 'Retries', name: 'Retries'},
    {title: 'Timeout', name: 'Timeout'},
    {title: 'Port', name: 'Port'},
    {title: 'Active', name: 'Active'},
    {title: 'SnmpVersion', name: 'SnmpVersion'},
    {title: 'Freq', name: 'Freq'},
    {title: 'Influx DB', name: 'OutDB'},
    {title: 'Log Level', name: 'LogLevel'},
    {title: 'SnmpDebug', name: 'SnmpDebug'},
    {title: 'TagName', name: 'LogLevel'},
    {title: 'TagValue', name: 'LogLevel'},
    {title: 'Extra Tags', name: 'LogLevel'},
    {title: 'Measurement Groups', name: 'MeasurementGroups'},
    {title: 'Measurement Filters', name: 'MeasFilters'}
    ];

  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;

  //Set config
  public config:any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };



  constructor(public snmpDeviceService: SnmpDeviceService, public influxserverDeviceService: InfluxServerService, public measgroupsDeviceService: MeasGroupService, public measfiltersDeviceService: MeasFilterService, builder: FormBuilder) {
    this.editmode='list';
    this.reloadData();
    this.snmpdevForm = builder.group({
    id: ['',Validators.required],
    Host: ['',Validators.required],
    Port: [161,Validators.required],
    Retries: [5],
    Timeout: [20],
    Active: ['true',Validators.required],
    SnmpVersion:['2c',Validators.required],
    Community: ['public'],
    V3SecLevel:[''],
    V3AuthUser:[''],
    V3AuthPass:[''],
    V3AuthProt:[''],
    V3PrivPass:[''],
    V3PrivProt:[''],
    Freq:[60,Validators.required],
    OutDB: ['',Validators.required],
    LogLevel:['info',Validators.required],
    SnmpDebug:['false',Validators.required],
    DeviceTagName: ['',Validators.required],
    DeviceTagValue: ['id'],
    Extratags:[''],
    MeasurementGroups: [''],
    MeasFilters: ['']
  });
    }

    reloadData(){
    // now it's a simple subscription to the observable
      this.snmpDeviceService.getDevices(null)
        .subscribe(
  				data => {
            this.snmpdevs = data;
            this.data = data;
            this.onChangeTable(this.config);
          },
  		  	err => console.error(err),
  		  	() => console.log('DONE')
  		  );
    }

    public changePage(page:any, data:Array<any> = this.data):Array<any> {
      let start = (page.page - 1) * page.itemsPerPage;
      let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
      return data.slice(start, end);
    }

    public changeSort(data:any, config:any):any {
      if (!config.sorting) {
        return data;
      }

      let columns = this.config.sorting.columns || [];
      let columnName:string = void 0;
      let sort:string = void 0;

      for (let i = 0; i < columns.length; i++) {
        if (columns[i].sort !== '' && columns[i].sort !== false) {
          columnName = columns[i].name;
          sort = columns[i].sort;
        }
      }

      if (!columnName) {
        return data;
      }

      // simple sorting
      return data.sort((previous:any, current:any) => {
        if (previous[columnName] > current[columnName]) {
          return sort === 'desc' ? -1 : 1;
        } else if (previous[columnName] < current[columnName]) {
          return sort === 'asc' ? -1 : 1;
        }
        return 0;
      });
    }

    public changeFilter(data:any, config:any):any {
      let filteredData:Array<any> = data;
      this.columns.forEach((column:any) => {
        if (column.filtering) {
          filteredData = filteredData.filter((item:any) => {
            return item[column.name].match(column.filtering.filterString);
          });
        }
      });

      if (!config.filtering) {
        return filteredData;
      }

      if (config.filtering.columnName) {
        return filteredData.filter((item:any) =>
          item[config.filtering.columnName].match(this.config.filtering.filterString));
      }

      let tempArray:Array<any> = [];
      filteredData.forEach((item:any) => {
        let flag = false;
        this.columns.forEach((column:any) => {
          if(!item[column.name]){
            item[column.name] = '--'
          }
            if (item[column.name].toString().match(this.config.filtering.filterString)) {
              flag = true;
            }

        });
        if (flag) {
          tempArray.push(item);
        }
      });
      filteredData = tempArray;

      return filteredData;
    }

    public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
      if (config.filtering) {
        Object.assign(this.config.filtering, config.filtering);
      }
      if (config.sorting) {
        Object.assign(this.config.sorting, config.sorting);
      }
      let filteredData = this.changeFilter(this.data, this.config);
      let sortedData = this.changeSort(filteredData, this.config);
      this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
      this.length = sortedData.length;
    }

    public onCellClick(data: any): any {
      console.log(data);
    }


    //ADDED:
    //
    onChange(value,controlName){
  		console.log("CONTROL NAME",controlName);
  		this.snmpdevForm.controls[controlName].patchValue(value);
  	}

  	onChangeGroup(value){
  		this.snmpdevForm.controls['MeasurementGroups'].patchValue(value);
  	}
  	onChangeFilter(value){
  		this.snmpdevForm.controls['MeasFilters'].patchValue(value);
  	}

    onFilter(){
  	this.reloadData();
    }

   viewItem(id){
     console.log("id: ",id);
    this.viewModal.parseObject(id);
   }
   removeItem(row){
    let id = row.ID;
  	console.log('remove',id);
  	var r = confirm("Deleting SNMPDEVICE: "+id+". Proceed?");
   	if (r == true) {
  		this.snmpDeviceService.deleteDevice(id)
  		 .subscribe(
  			data => { console.log(data) },
  			err => console.error(err),
  			() => {this.editmode = "list"; this.reloadData()}
  			);

   	}
   }
   newDevice(){
  	 this.editmode = "create";
  	 this.getInfluxServersforDevices();
  	 this.getMeasGroupsforDevices();
  	 this.getMeasFiltersforDevices();

   }
   editDevice(row){
     let id =row.ID;
  	 //Get select options
  	 this.getInfluxServersforDevices();
  	 this.getMeasGroupsforDevices();
  	 this.getMeasFiltersforDevices();

  	 this.snmpDeviceService.getDevicesById(id)
   		 .subscribe(data => {
  			 //Set data on testsnmpdev
  			 this.testsnmpdev = data;
  			 //Update measgroups and filters:
  	 		this.snmpdevForm.controls['MeasurementGroups'].patchValue(this.testsnmpdev.MeasurementGroups);
  			this.snmpdevForm.controls['MeasFilters'].patchValue(this.testsnmpdev.MeasFilters);
  		  },
   		 err => console.error(err),
   		 () =>  this.editmode = "modify"
   				 );
   }
   cancelEdit(){
  	 this.editmode = "list";
   }
   saveSnmpDev(){
  	 if(this.snmpdevForm.dirty && this.snmpdevForm.valid) {
  		 console.log("FORM", this.snmpdevForm);
  		 this.snmpDeviceService.addDevice(this.snmpdevForm.value)
  		 .subscribe(data => { console.log(data) },
        err => console.error(err),
        () =>  {this.editmode = "list"; this.reloadData()}
  			);
  		}
   }

   updateSnmpDev(oldId){
  	 console.log(oldId);
  	 console.log(this.snmpdevForm.value.id);
  	 console.log("FORM", this.snmpdevForm.value);
  	 if(this.snmpdevForm.valid) {
  		 var r = true;
  		 if (this.snmpdevForm.value.id != oldId) {
  			r = confirm("Changing Device ID from "+oldId+" to " +this.snmpdevForm.value.id+". Proceed?");
  		 }
  		if (r == true) {
  				this.snmpDeviceService.editDevice(this.snmpdevForm.value, oldId)
  				.subscribe(data => { console.log(data) },
  	       err => console.error(err),
  	       () =>  {this.editmode = "list"; this.reloadData()}
  	 			);
  		}
  	}
   }

   getMeasGroupsforDevices(){
   this.measgroupsDeviceService.getMeasGroup(null)
   .subscribe(
  	 data => {
  		 this.measgroups = data
  		 this.selectgroups = [];
  		 this.snmpdevForm.controls['MeasurementGroups'].reset();
  		 for (let entry of data) {
  		 	console.log(entry)
  		 	this.selectgroups.push({'id' : entry.ID , 'name' : entry.ID});
  		 }
  	  },
  	 err => console.error(err),
  	 () => console.log('DONE')
   	);
   }

   getInfluxServersforDevices(){
   this.influxserverDeviceService.getInfluxServer(null)
   .subscribe(
  	 data => { this.influxservers = data },
  	 err => console.error(err),
  	 () => console.log('DONE')
   	);
   }

   getMeasFiltersforDevices(){
   this.measfiltersDeviceService.getMeasFilter(null)
   .subscribe(
  	data => {
  		this.measfilters = data
  		this.selectfilters = [];
  		this.snmpdevForm.controls['MeasFilters'].reset();
  		for (let entry of data) {
  			console.log(entry)
  			this.selectfilters.push({'id' : entry.ID , 'name' : entry.ID});
  		}
  	 },
  	err => console.error(err),
  	() => console.log('DONE')
  	 );
   }
  }
