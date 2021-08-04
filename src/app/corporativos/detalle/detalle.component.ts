import { Component, OnInit, ViewEncapsulation, LOCALE_ID, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorporativosService } from "../_services/corporativos.service";
import localeEs from "@angular/common/locales/es";
import { DatePipe, registerLocaleData } from "@angular/common";
import { NgbDateStruct, NgbDatepickerI18n, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { from } from 'rxjs';

const now = new Date();
const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  }
};
@Injectable()
export class I18n {
  language = 'es';
}
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss','/assets/sass/pages/page-users.scss', '/assets/sass/libs/select.scss','/assets/sass/libs/datepicker.scss'],
  providers:[{provide:LOCALE_ID, useValue:'es'},I18n,DatePipe, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}],
  encapsulation: ViewEncapsulation.None,
})
export class DetalleComponent implements OnInit {

  model: NgbDateStruct;
  contactos = []
  idCorporativo
  editCorporativo = false
  formDetalle: FormGroup;
  formContacto: FormGroup;
  logoUrl = ''
  nombre = ''
  disabled = true;
  date: {year: number, month: number};
  editContacto = false
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service : CorporativosService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    ) {
      this.formDetalle = this.fb.group({
        id: ['', Validators.required],
        S_NombreCorto: [''],
        S_NombreCompleto:[''],
        S_SystemUrl:['',Validators.required],
        S_Activo:[0,Validators.required],
        D_FechaIncorporacion:['',Validators.required],
        fecha:['',Validators.required],
        FK_Asignado_id:[''],
        S_LogoURL:['']
       
      });
      this.formContacto = this.fb.group({
        id: [''],
        N_TelefonoFijo: [''],
        N_TelefonoMovil:[''],
        S_Comentarios:[''],
        S_Email:[''],
        S_Nombre:[''],
        S_Puesto:[''],
        tw_corporativo_id:['']
       
      });
     }

  ngOnInit(): void {
    // this.selectToday();
    if(this.activatedRoute.snapshot.params.id){
      this.getDetail(this.activatedRoute.snapshot.params.id)
    }
    
  }

  getDetail(id){
    this.service.detail(id).subscribe((res)=>{
      console.log(res)
      this.logoUrl = res.data.corporativo.S_LogoURL
      this.nombre = res.data.corporativo.S_NombreCorto
      this.idCorporativo = res.data.corporativo.id
      this.contactos = res.data.corporativo.tw_contactos_corporativo
      this.formDetalle.controls['id'].setValue(res.data.corporativo.id);
      this.formDetalle.controls['S_LogoURL'].setValue(res.data.corporativo.S_LogoURL);
      this.formDetalle.controls['FK_Asignado_id'].setValue(res.data.corporativo.FK_Asignado_id);
      this.formDetalle.controls['S_NombreCorto'].setValue(res.data.corporativo.S_NombreCorto);
      this.formDetalle.controls['S_NombreCompleto'].setValue(res.data.corporativo.S_NombreCompleto);
      this.formDetalle.controls['S_SystemUrl'].setValue(res.data.corporativo.S_SystemUrl);
      this.formDetalle.controls['S_Activo'].setValue(res.data.corporativo.S_Activo);
      this.formDetalle.controls['D_FechaIncorporacion'].setValue(res.data.corporativo.D_FechaIncorporacion);
      if(res.data.corporativo.D_FechaIncorporacion){
        let f = new Date(res.data.corporativo.D_FechaIncorporacion);
        
        this.model = {year: f.getFullYear(), month: f.getMonth() + 1, day: f.getDate()};
        this.formDetalle.controls['fecha'].setValue(this.model);
      }
      console.log(this.nombre)
    },(error)=>{
      console.log(error)
    })
  }

  // Selects today's date
  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.formDetalle.controls['fecha'].setValue(this.model);
  }
  // Custom Day View Starts
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
  }
  // Custom Day View Ends
  fechaSelectAct(event){
    let d = '';
      if(event.day < 10){
        d='0'+event.day;
      }else{
        d=event.day;
      }
      let m = '';
      if(event.month < 10){
        m='0'+event.month;
      }else{
        m=event.month;
      }
    var fecha = event.year+'-'+m+'-'+d;
    this.formDetalle.controls['D_FechaIncorporacion'].setValue(fecha);
  
  }

  edit(value){
    if(value == 1){
     this.editCorporativo = true 
    }else{
      this.editCorporativo = false
    }
    
  }

  update(){
    console.log(this.formDetalle.value)
    this.spinner.show();
    if(this.formDetalle.invalid){
      this.spinner.hide();
      return;
    }

    this.service.updateDetail(this.idCorporativo,this.formDetalle.value).subscribe((res)=>{
      this.spinner.hide();
      swal.fire({
        icon: 'success',
        title: '¡Actualizacion Exitosa!',
        text: '',
        showConfirmButton: false,
        timer: 4000,
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
      this.getDetail(this.idCorporativo)
    },(error)=>{
      this.spinner.hide();
      swal.fire({
        title: "¡Error!",
        text: "Revisa tus datos",
        icon: "error",
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
    })

  }
  
  editContact(contacto){
    this.editContacto = true;
    this.formContacto.controls['id'].setValue(contacto.id)
    this.formContacto.controls['N_TelefonoFijo'].setValue(contacto.N_TelefonoFijo)
    this.formContacto.controls['N_TelefonoMovil'].setValue(contacto.N_TelefonoMovil)
    this.formContacto.controls['S_Comentarios'].setValue(contacto.S_Comentarios)
    this.formContacto.controls['S_Email'].setValue(contacto.S_Email)
    this.formContacto.controls['S_Nombre'].setValue(contacto.S_Nombre)
    this.formContacto.controls['S_Puesto'].setValue(contacto.S_Puesto)
    this.formContacto.controls['tw_corporativo_id'].setValue(contacto.tw_corporativo_id)
    

  }
  addContact(){
    
    this.spinner.show();
    if(this.formDetalle.invalid){
      this.spinner.hide();
      return;
    }
    this.formContacto.controls['tw_corporativo_id'].setValue(this.idCorporativo)
    this.service.addContact(this.formContacto.value).subscribe((res)=>{
      this.spinner.hide();
      swal.fire({
        icon: 'success',
        title: '¡Guardado Exitoso!',
        text: '',
        showConfirmButton: false,
        timer: 4000,
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
      this.formContacto.reset();
      this.getDetail(this.idCorporativo)
    },(error)=>{
      this.spinner.hide();
      swal.fire({
        title: "¡Error!",
        text: "Revisa tus datos",
        icon: "error",
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
    })
  }
  updateContact(){
    this.spinner.show();
    if(this.formDetalle.invalid){
      this.spinner.hide();
      return;
    }
    let idContact = this.formContacto.get('id').value
    this.service.updateContact(idContact,this.formContacto.value).subscribe((res)=>{
      this.spinner.hide();
      swal.fire({
        icon: 'success',
        title: '¡Actualizacion Exitosa!',
        text: '',
        showConfirmButton: false,
        timer: 4000,
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
      this.formContacto.reset();
      this.editContacto = false
      this.getDetail(this.idCorporativo)
    },(error)=>{
      this.spinner.hide();
      swal.fire({
        title: "¡Error!",
        text: "Revisa tus datos",
        icon: "error",
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
    })
  }
  deleteContact(contacto){
    let confirm = swal.fire({
      title: "¡Eliminar!",
      text: "¿Seguro quieres eliminar el registro?",
      icon: "warning",
      showCancelButton:true,
      cancelButtonText:"Cancelar",
      confirmButtonText:"Confirmar",
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false,
    });
    confirm.then(result=>{
      if(result.value){
        this.spinner.show();
        if(this.formDetalle.invalid){
          this.spinner.hide();
          return;
        }
        let idContact = contacto.id
        this.service.deleteContact(idContact).subscribe((res)=>{
          this.spinner.hide();
          swal.fire({
            icon: 'success',
            title: '¡Eliminacion Exitosa!',
            text: '',
            showConfirmButton: false,
            timer: 4000,
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
          });
          this.getDetail(this.idCorporativo)
        },(error)=>{
          this.spinner.hide();
          swal.fire({
            title: "¡Error!",
            text: "Revisa tus datos",
            icon: "error",
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
          });
        })
      }
    })
    
  }
}
