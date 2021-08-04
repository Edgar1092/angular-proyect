import { Component, OnInit, ViewChild, ViewEncapsulation, LOCALE_ID } from "@angular/core";
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { CorporativosService } from "../_services/corporativos.service";

import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: [
    './lista.component.scss',
    '/assets/sass/libs/datatables.scss',
  ],
  providers:[{provide:LOCALE_ID, useValue:'es'}],
  encapsulation: ViewEncapsulation.None,
})
export class ListaComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // row data
  public rows = [];
  public ColumnMode = ColumnMode;
  public limitRef = 10;

  // column header
  public columns = [
    { name: "Corporativo", prop: "S_NombreCompleto" },
    { name: "Url", prop: "S_SystemUrl" },
    { name: "Incorporacion", prop: "D_FechaIncorporacion" },
    { name: "Creado el", prop: "created_at" },
    { name: "Asignado a", prop: "asignado" },
    { name: "Estatus", prop: "S_Activo" },
    { name: "Actions", prop: "Actions" },
  ];

  // private
  private tempData = [];

  constructor(private service : CorporativosService) {
    
  }
  ngOnInit(): void {
    this.getList()
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  getList(){
    this.service.list().subscribe((res)=>{
      console.log(res);
      this.rows = res.data
      this.tempData = res.data
    },(error)=>{
      console.log(error)
    })
  }
  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.Username.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * updateLimit
   *
   * @param limit
   */
  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }
}
