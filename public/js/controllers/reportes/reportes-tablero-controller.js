(function() {
  'use strict';

  class ReportesTablero {

    constructor($state, qaService, $mdToast, $mdMenu, $mdDialog, $scope) {
        
        this._qaService = qaService;
        this._$mdDialog = $mdDialog;
        this._$state = $state;

        this._$scope = $scope;       


        this.sql_reporte_correo = {

          rechazos_sijai: "SELECT tt.lote, tt.estado_causa, tt.id_p_estado_notificacion, tt.errores, count(*) as cuenta\n" +
          "FROM (\n" +
                "SELECT  ac.lote, \n" +
                        "n.numero_pieza,\n" +
                        "--ca.numero_causa,\n" +
                        "pec.estado_causa,\n" +
                        "n.id_p_estado_notificacion,\n" +
                        "t2.errores\n" +
                "FROM archivos_cabeceras ac\n" +
                "JOIN archivos_detalles ad ON ad.id_archivo_cabecera = ac.id_archivo_cabecera\n" +
                "JOIN (\n" +
                        "SELECT ad.id_archivo_detalle, REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') as numero_pieza\n" +
                        "FROM archivos_detalles ad\n" +
                        "JOIN archivos_cabeceras ac ON ad.id_archivo_cabecera = ac.id_archivo_cabecera\n" +
                        "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote17082906_171005.txt%' --and ac.id_archivo_cabecera = 5453\n" +
                ") t ON t.id_archivo_detalle = ad.id_archivo_detalle--t.numero_pieza = n.numero_pieza--t.track_and_trace = ri.recibo_imposicion\n" +
                "JOIN notificaciones n ON n.numero_pieza = t.numero_pieza\n" +
                "JOIN r_causas_notificaciones rcn ON rcn.id_notificacion = n.id_notificacion\n" +
                "JOIN causas ca ON ca.id_causa = rcn.id_causa\n" +
                "JOIN p_estados_causas pec ON pec.id_p_estado_causa = ca.id_p_estado_causa\n" +
                "JOIN (\n" +
                  "SELECT TRIM(\n" +
                  "SUBSTR(ad.archivo_detalle,\n" +
                  "INSTR (ad.archivo_detalle,';',1,21)+1,\n" +
                  "DECODE(INSTR (ad.archivo_detalle,';',1,21+1)-1,-1,LENGTH(ad.archivo_detalle),\n" +
                  "INSTR (ad.archivo_detalle,';',1,21+1)-1) - INSTR (ad.archivo_detalle,';',1,21)))  as numero_pieza,\n" +
                                "LISTAGG(COALESCE(rade.id_p_error_archivo, 0), ',')\n" +
                                "WITHIN GROUP (ORDER BY REGEXP_SUBSTR(ad.archivo_detalle,'[0-9]{10,12}')) as errores\n" +
                        "FROM archivos_cabeceras ac\n" +
                        "JOIN archivos_detalles ad ON ad.id_archivo_cabecera = ac.id_archivo_cabecera \n" +
                        "LEFT JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle = ad.id_archivo_detalle\n" +
                        "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote17082906_171005.txt%'\n" +
                        "GROUP BY TRIM(\n" +
                  "SUBSTR(ad.archivo_detalle,\n" +
                  "INSTR (ad.archivo_detalle,';',1,21)+1,\n" +
                  "DECODE(INSTR (ad.archivo_detalle,';',1,21+1)-1,-1,LENGTH(ad.archivo_detalle),\n" +
                  "INSTR (ad.archivo_detalle,';',1,21+1)-1) - INSTR (ad.archivo_detalle,';',1,21)))\n" +                 
                
                ") t2 ON t2.numero_pieza = t.numero_pieza\n" +
                
                
                "--JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle =t.id_archivo_detalle\n" +
                "--WHERE N.ID_P_TIPO_NOTIFICACION in (1,2)\n" +
                
                "UNION\n" +
                "--- PIEZAS QUE NO EXISTEN (no se crearon notificaciones con el numero_pieza de la novedad)\n" +
                "SELECT  ac.lote,\n" +
                       "-- REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','') AS numero_pieza,\n" +
                        "REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') as numero_pieza,\n" +
                        "--null as numero_causa,\n" +
                        "--'ERROR FORMATO PIEZA:' ||  COALESCE(REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|',''), SUBSTR(ad.archivo_detalle,26,13)) || ',' as estado_causa,\n" +
                        "'ERROR FORMATO PIEZA:' ||  COALESCE(REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';',''), SUBSTR(ad.archivo_detalle,26,13)) || ',' as estado_causa,\n" +
                        "null as id_p_estado_notificacion,\n" +
                        "to_char(rade.id_p_error_archivo)\n" +
                        
                "FROM archivos_cabeceras ac\n" +
                "JOIN archivos_detalles ad ON ac.id_archivo_cabecera = ad.id_archivo_cabecera\n" +
                "LEFT JOIN notificaciones n ON n.numero_pieza = REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','')--REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','')\n" +
                "JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle = ad.id_archivo_detalle\n" +
                "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote17082906_171005.txt%' --and ac.id_archivo_cabecera = 5453\n" +
                "AND n.numero_pieza is null\n" +
                      
                "UNION\n" +
                "--- PIEZAS QUE NO SE IMPUSIERON (novedades de causas no impuestas)\n" +
                "SELECT  ac.lote,\n" +
                       "-- REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','') AS numero_pieza,\n" +
                        "REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') as numero_pieza,\n" +
                        "--null as numero_causa,\n" +
                        "'SIN IMPOSICION: ' ||  REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') || ',' as estado_causa,\n" +
                        "null as id_p_estado_notificacion,\n" +
                        "to_char(rade.id_p_error_archivo)\n" +
                  
                "FROM archivos_cabeceras ac\n" +
                "JOIN archivos_detalles ad ON ac.id_archivo_cabecera = ad.id_archivo_cabecera\n" +
                "LEFT JOIN recibos_imposiciones ri ON ri.recibo_imposicion = REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','')--REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','')\n" +
                "JOIN notificaciones n ON n.id_notificacion = ri.id_notificacion\n" +
                "JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle = ad.id_archivo_detalle\n" +
                "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote17082906_171005.txt%' --and ac.id_archivo_cabecera = 5453\n" +
                "AND ri.recibo_imposicion IS NULL\n" +
            
          ") tt\n" +

          "GROUP BY tt.lote, tt.estado_causa, tt.id_p_estado_notificacion,tt.errores\n" +
          "ORDER by lote, id_p_estado_notificacion, estado_causa DESC;",


          rechazos_cecaitra: "SELECT tt.lote, tt.estado_causa, tt.id_p_estado_notificacion, tt.errores, count(*) as cuenta\n" +
          "FROM (\n" +
                "SELECT  ac.lote, \n" +
                        "n.numero_pieza,\n" +
                       "-- c.numero_causa,\n" +
                        "pec.estado_causa,\n" +
                        "n.id_p_estado_notificacion,\n" +
                        "--rade.id_p_error_archivo\n" +
                        "t2.errores\n" +
                        
                "FROM archivos_cabeceras ac\n" +
                "JOIN archivos_detalles ad ON ad.id_archivo_cabecera = ac.id_archivo_cabecera \n" +
                "JOIN actas a ON a.id_archivo_detalle = ad.id_archivo_detalle\n" +
                "JOIN causas c ON c.id_acta = a.id_acta\n" +
                "JOIN r_causas_notificaciones rcn ON rcn.id_causa = c.id_causa\n" +
                "JOIN notificaciones n ON n.id_notificacion = rcn.id_notificacion\n" +
                "--JOIN recibos_imposiciones ri ON ri.id_notificacion = rcn.id_notificacion\n" +
                "JOIN p_estados_causas pec ON pec.id_p_estado_causa = c.id_p_estado_causa\n" +
                "JOIN (\n" +
                        "--SELECT ad.id_archivo_detalle, SUBSTR(ad.archivo_detalle,26,13) AS track_and_trace\n" +
                       "-- SELECT ad.id_archivo_detalle, REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}') as t,  REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'),'|','') AS numero_pieza--REGEXP_SUBSTR(ad.archivo_detalle,'[0-9]{10,12}') AS numero_pieza\n" +
                        "SELECT ad.id_archivo_detalle, \n" +
                        "--REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') as numero_pieza\n" +
                        "TRIM(\n" +
                  "SUBSTR(ad.archivo_detalle,\n" +
                  "INSTR (ad.archivo_detalle,';',1,21)+1,\n" +
                  "DECODE(INSTR (ad.archivo_detalle,';',1,21+1)-1,-1,LENGTH(ad.archivo_detalle),\n" +
                  "INSTR (ad.archivo_detalle,';',1,21+1)-1) - INSTR (ad.archivo_detalle,';',1,21)))  as numero_pieza\n" +
                        "FROM archivos_detalles ad\n" +
                        "JOIN archivos_cabeceras ac ON ad.id_archivo_cabecera = ac.id_archivo_cabecera \n" +
                        "--LEFT JOIN notificaciones n ON n.numero_pieza = REGEXP_SUBSTR(ad.archivo_detalle,'[0-9]{10,12}')\n" +
                        "--JOIN recibos_imposiciones ri ON ri.recibo_imposicion = SUBSTR(ad.archivo_detalle,26,13)\n" +
                        "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote00000518_180222.txt%'\n" +
                ") t ON t.numero_pieza = n.numero_pieza--t.track_and_trace = ri.recibo_imposicion\n" +
                "--JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle = t.id_archivo_detalle\n" +
                "JOIN (\n" +
                
                  "SELECT TRIM(\n" +
                  "SUBSTR(ad.archivo_detalle,\n" +
                  "INSTR (ad.archivo_detalle,';',1,21)+1,\n" +
                  "DECODE(INSTR (ad.archivo_detalle,';',1,21+1)-1,-1,LENGTH(ad.archivo_detalle),\n" +
                  "INSTR (ad.archivo_detalle,';',1,21+1)-1) - INSTR (ad.archivo_detalle,';',1,21)))  as numero_pieza,\n" +
                                "LISTAGG(COALESCE(rade.id_p_error_archivo, 0), ',')\n" +
                                "WITHIN GROUP (ORDER BY TRIM(\n" +
                  "SUBSTR(ad.archivo_detalle,\n" +
                  "INSTR (ad.archivo_detalle,';',1,21)+1,\n" +
                  "DECODE(INSTR (ad.archivo_detalle,';',1,21+1)-1,-1,LENGTH(ad.archivo_detalle),\n" +
                  "INSTR (ad.archivo_detalle,';',1,21+1)-1) - INSTR (ad.archivo_detalle,';',1,21)))) as errores\n" +
                        "FROM archivos_cabeceras ac\n" +
                        "JOIN archivos_detalles ad ON ad.id_archivo_cabecera = ac.id_archivo_cabecera \n" +
                        "LEFT JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle = ad.id_archivo_detalle\n" +
                        "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote00000518_180222.txt%'\n" +
                        "GROUP BY TRIM(\n" +
                  "SUBSTR(ad.archivo_detalle,\n" +
                  "INSTR (ad.archivo_detalle,';',1,21)+1,\n" +
                  "DECODE(INSTR (ad.archivo_detalle,';',1,21+1)-1,-1,LENGTH(ad.archivo_detalle),\n" +
                  "INSTR (ad.archivo_detalle,';',1,21+1)-1) - INSTR (ad.archivo_detalle,';',1,21)))\n" +
                  
                  
                  "--WHERE rade.id_archivo_detalle = t.id_archivo_detalle\n" +
                  
                
                ") t2 ON t2.numero_pieza = t.numero_pieza\n" +
                "WHERE N.ID_P_TIPO_NOTIFICACION in (1,2)\n" +
                
                "UNION\n" +
                "--- PIEZAS QUE NO EXISTEN (no se crearon notificaciones con el numero_pieza de la novedad)\n" +
                "SELECT  ac.lote,\n" +
                       "-- REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','') AS numero_pieza,\n" +
                        "REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') as numero_pieza,\n" +
                        "--null as numero_causa,\n" +
                        "--'ERROR FORMATO PIEZA:' ||  COALESCE(REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|',''), SUBSTR(ad.archivo_detalle,26,13)) || ',' as estado_causa,\n" +
                        "'ERROR FORMATO PIEZA:' ||  COALESCE(REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';',''), SUBSTR(ad.archivo_detalle,26,13)) || ',' as estado_causa,\n" +
                        "null as id_p_estado_notificacion,\n" +
                        "to_char(rade.id_p_error_archivo)\n" +
                        
                "FROM archivos_cabeceras ac\n" +
                "JOIN archivos_detalles ad ON ac.id_archivo_cabecera = ad.id_archivo_cabecera\n" +
                "LEFT JOIN notificaciones n ON n.numero_pieza = REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','')--REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','')\n" +
                "JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle = ad.id_archivo_detalle\n" +
                "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote00000519_180222.txt%'\n" +
                "AND n.numero_pieza is null\n" +
                      
                "UNION\n" +
                "--- PIEZAS QUE NO SE IMPUSIERON (novedades de causas no impuestas)      \n" +
                "SELECT  ac.lote,\n" +
                       "-- REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','') AS numero_pieza,\n" +
                        "REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') as numero_pieza,\n" +
                        "--null as numero_causa,\n" +
                        "'SIN IMPOSICION: ' ||  REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','') || ',' as estado_causa,\n" +
                        "null as id_p_estado_notificacion,\n" +
                        "to_char(rade.id_p_error_archivo)\n" +
                  
                "FROM archivos_cabeceras ac\n" +
                "JOIN archivos_detalles ad ON ac.id_archivo_cabecera = ad.id_archivo_cabecera\n" +
                "LEFT JOIN recibos_imposiciones ri ON ri.recibo_imposicion = REPLACE(REPLACE(COALESCE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){10,12}'), REGEXP_SUBSTR(ad.archivo_detalle,'\;([0-9]){10,12}')),';',''), ';','')--REPLACE(REGEXP_SUBSTR(ad.archivo_detalle,'\|([0-9]){12}'),'|','')\n" +
                "JOIN notificaciones n ON n.id_notificacion = ri.id_notificacion\n" +
                "JOIN r_archivos_detalles_errores rade ON rade.id_archivo_detalle = ad.id_archivo_detalle\n" +
                "WHERE ad.id_p_estado_archivo_detalle=3 AND ac.id_p_tipo_archivo=4 AND ac.nombre_archivo like '%R_Lote00000519_180222.txt%'\n" +
                "AND ri.recibo_imposicion IS NULL\n" +
            
          ") tt\n" +

          "GROUP BY tt.lote, tt.estado_causa, tt.id_p_estado_notificacion, tt.errores\n" +
          "ORDER by lote, id_p_estado_notificacion, estado_causa DESC;"


        };


        this.sql_estado_lotes = {

          estado_lotes: "ALTER SESSION SET CURRENT_SCHEMA = US_SVIAL_SIJAI_OWNER;\n" +
          "select ac.lote, r.numero_remito, z.zona, pea.estado_archivo, ac.f_auditoria from archivos_cabeceras ac\n" +
          "join archivos_detalles ad ON ad.id_archivo_cabecera = ac.id_archivo_cabecera\n" +
          "join p_estados_archivos pea ON pea.id_p_estado_archivo = ac.id_p_estado_archivo\n" +
          "join remitos r ON r.id_remito = ac.id_remito\n" +
          "join zonas z ON z.id_zona = r.id_zona\n" +
          "where ac.id_remito is not null and ac.id_p_estado_archivo in (2,6,7,1)\n" +
          "group by ac.lote, r.numero_remito, ac.f_auditoria, pea.estado_archivo, z.zona\n" +
          "order by z.zona, ac.lote, pea.estado_archivo",

          lotes_personales_pendientes: "SELECT ac.lote, r.cantidad_actas as actas_informadas_en_remito, t.cant as actas_en_csv, count(*) as actas_creadas, (t.cant - count(*)) as pendientes\n"+
          "from remitos_actas ra\n"+
          "join remitos r on r.id_remito = ra.id_remito\n"+
          "join actas act on act.numero = ra.numero_acta\n"+
          "join archivos_detalles ad on ad.id_archivo_detalle = act.id_archivo_detalle\n"+
          "join archivos_cabeceras ac on ac.id_archivo_cabecera = ad.id_archivo_cabecera\n"+
          "join (\n"+
             "SELECT ra.id_remito, count(*) as cant FROM remitos_actas ra\n"+
             "--join actas act on act.numero = ra.numero_acta\n"+
             "group by ra.id_remito\n"+
          ") t on t.id_remito = ra.id_remito\n"+
          "where ac.id_remito is not null and ac.id_p_estado_archivo in (2,6,7,1)\n"+
          "group by ac.lote, r.cantidad_actas,t.cant\n"+
          "order by ac.lote"

        };

        this.sql_reportes_otros = {

          nro_doc_repetido: "SELECT t.nro_doc, pe.* \n" +  
          "FROM (\n" +
          "select nro_doc, count(*) as persona from personas\n"+
          "group by nro_doc having count(*) > 1\n"+
          ") t\n"+
          "join personas pe on pe.nro_doc = t.nro_doc\n",

          detalle_causa: "ALTER SESSION SET CURRENT_SCHEMA = US_SVIAL_SIJAI_OWNER;\n"+
          "select ac.id_acta,ca.id_causa, ca.numero_causa, ca.id_p_estado_causa,pec.ESTADO_CAUSA,noti.id_notificacion,noti.id_p_estado_notificacion,pen.ESTADO_NOTIFICACION,noti.f_emision,noti.f_vencimiento,noti.id_resolucion,noti.cuotas,mdc.id_movimiento_cuenta,mdc.id_p_estado_mov_cuenta,pemc.ESTADO_MOV_CUENTA,noti.importe,mdc.importe_cobrado,mdc.importe_saldo,noti.codigo_barras\n"+
          "from causas ca \n"+
          "join actas ac on (ac.id_acta = ca.id_acta)\n"+
          "join r_causas_notificaciones rcn on (ca.id_causa = rcn.id_causa)\n"+
          "join notificaciones noti on (rcn.id_notificacion = noti.id_notificacion)\n"+
          "join movimientos_cuentas mdc on (noti.id_notificacion = mdc.id_notificacion)\n"+
          "join P_ESTADOS_MOV_CUENTAS pemc on (mdc.ID_P_ESTADO_MOV_CUENTA=pemc.ID_P_ESTADO_MOV_CUENTA)\n"+
          "join P_ESTADOS_CAUSAS pec on (pec.ID_P_ESTADO_CAUSA = ca.ID_P_ESTADO_CAUSA)\n"+
          "join P_ESTADOS_NOTIFICACIONES pen on (pen.ID_P_ESTADO_NOTIFICACION = noti.ID_P_ESTADO_NOTIFICACION)\n"+
          "where ca.numero_causa = 00603759\n"+
          "order by noti.f_emision asc;",


          causas_sancion_localidad: "select\n"+
          "ca.numero_causa,\n"+
          "a.lote,\n"+
          "a.f_infraccion,\n"+
          "pta.Tipo_acta,\n"+
          "per.nro_doc, \n"+
          "case id_p_tipo_doc_persona\n"+
          "when 6 then razon_social \n"+
          "else nombre || ' ' || apellido \n"+
          "end as nombre_infractor,\n"+
          "pp.provincia as PROV_INFRACTOR,\n"+
          "rdc.localidad,\n"+
          "pec.estado_causa\n"+
          "from actas a\n"+
           "inner join p_tipos_actas pta on pta.id_p_tipo_acta = a.id_p_tipo_acta       \n"+
           "inner join causas ca on ca.id_acta = a.id_acta\n"+
           "inner join r_causas_personas rcp on rcp.id_causa = ca.id_causa\n"+
           "inner join r_domicilios_cau_per rdc on rdc.id_r_causa_persona = rcp.id_r_causa_persona\n"+
           "inner join p_provincias pp on pp.id_p_provincia = rdc.id_p_provincia\n"+
           "inner join personas per on per.id_persona = rcp.id_persona\n"+
           "inner join p_estados_causas pec on pec.id_p_estado_causa = ca.id_p_estado_causa\n"+
          "where TO_CHAR(a.f_infraccion, 'YYYY') in ('2015','2016','2017','2018')\n"+
          "and ca.id_p_estado_causa = 5 and upper(rdc.localidad) = 'ROSARIO'\n"+
          "order by TO_CHAR(a.f_infraccion, 'YYYYMM')",


          causas_multiples_resoluciones: "SELECT CA.id_causa, CA.NUMERO_CAUSA, PEC.ESTADO_CAUSA, r.*\n"+
          "FROM CAUSAS CA\n"+
          "JOIN P_ESTADOS_CAUSAS PEC ON CA.ID_P_ESTADO_CAUSA=PEC.ID_P_ESTADO_CAUSA\n"+
          "JOIN(\n"+
          "SELECT C.NUMERO_CAUSA,COUNT(*) FROM R_CAUSAS_RESOLUCIONES RCR\n"+
          "JOIN CAUSAS C ON RCR.ID_CAUSA=C.ID_CAUSA\n"+
          "JOIN RESOLUCIONES R ON RCR.ID_RESOLUCION=R.ID_RESOLUCION\n"+

          "WHERE R.ID_P_ESTADO_RESOLUCION=2\n"+
          "GROUP BY C.NUMERO_CAUSA\n"+
          "HAVING COUNT(*)>1) CON ON CA.NUMERO_CAUSA=CON.NUMERO_CAUSA\n"+
          "join r_causas_resoluciones rcr1 on rcr1.id_causa = ca.id_causa\n"+
          "join resoluciones r on r.id_resolucion = rcr1.id_resolucion\n"+
          "order by ca.numero_causa"

          

        };
        
        this.activate();
     
                        
    }; //FIN CONSTRUCTOR
 
    

    //--
    // METODOS PUBLICOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--


    abrirReporte( reporte ){

      let form_data = {};


      switch( reporte ){

        case 'nro_doc_repetido': 
          form_data = {
            titulo: 'NRO_DOC Repetidos', 
            sql: this.sql_reportes_otros.nro_doc_repetido
          };
        break;

        case 'detalle_causa':
          form_data = {
            titulo: 'Detalle de causa', 
            sql: this.sql_reportes_otros.detalle_causa
          };
        break;

        case 'estado_lotes': 
          form_data = {
            titulo: 'Estado lotes CECAITRA', 
            sql: this.sql_estado_lotes.estado_lotes
          };
        break;

        case 'rechazos_sijai': 
          form_data = {
            titulo: 'Novedades SIJAI rechazadas', 
            sql: this.sql_reporte_correo.rechazos_sijai
          };
        break;

        case 'rechazos_cecaitra': 
          form_data = {
            titulo: 'Novedades CECAITRA rechazadas', 
            sql: this.sql_reporte_correo.rechazos_cecaitra
          };
        break;

        case 'causas_sancion_localidad': 
          form_data = {
            titulo: 'Causas c/sansion x localidad', 
            sql: this.sql_reportes_otros.causas_sancion_localidad
          };
        break;

         case 'lotes_personales_pendientes': 
          form_data = {
            titulo: 'Lotes personales con registros pendientes', 
            sql: this.sql_estado_lotes.lotes_personales_pendientes
          };
        break;

         case 'causas_multiples_resoluciones': 
          form_data = {
            titulo: 'Causa con multiples resoluciones activas', 
            sql: this.sql_reportes_otros.causas_multiples_resoluciones
          };
        break;

      }

        this._abrirDialogo(form_data, this);
           
    };


    //--
    // METODOS PRIVADOS
    //--
    // COMPONENTE: CASOS_REPRODUCCIONES
    //--

    activate(){

      let controller_obj = this;

      
      //this._cargarReproducciones( controller_obj );

     //console.log(this.reproducciones);

     // console.log(this.reproducciones)
    };


    //metodo que encapsula el uso del cuadro de dialogo.
    //lo invoca _cargarFormularioReproduccion
    _abrirDialogo( form_data, QAReproducciones ){

        

      console.log(form_data)
     
      //form_data = angular.extend(form_data, id_caso_prueba)

      this._$mdDialog.show({
            templateUrl: './views/reportes/reportes-dialogo-template.html',
            controller: 'ReportesTableroDialogo as vm',
            //parent: angular.element(document.body),
            targetEvent: this.originatorEv,
            hasBackdrop: true,
            clickOutsideToClose:false,
            escapeToClose: true,
            fullscreen: false, // Only for -xs, -sm breakpoints.
            multiple: true,
            bindToController: true,
            locals: {data: form_data}//{reproduccion_data: form_data}
        })
        .then(onFinally)
        //.finally(onFinally)
        
        function onFinally( callback_data ){

        };

    };


    reportarProblemaCasoPrueba( id_caso_prueba ){

      event.stopPropagation();
      
      const plantilla_url = './views/qa/reproducciones/qa-reproduccion-reportar-template.html',
            controlador_plantilla = 'QACasoPruebaReporte as vm';



      this._abrirDialogo( plantilla_url,controlador_plantilla,{id_reproduccion: 3, id_reproduccon_caso_prueba: 2}, this );


    };

    
  }; //FIN CLASE



  ReportesTablero.$inject = ['$state', 'qaService', '$mdToast', '$mdMenu', '$mdDialog', '$scope'];
  angular
    .module('lotes.lote')
    .controller('ReportesTablero', ReportesTablero);
}());