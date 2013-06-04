var map;
var map2;
var map3;
var map4;
var map5;

var latlng;

var markersArray = [];
var markersArray2 = [];
var markersArray3 = [];
var markersArray4 = [];
var markersArray5 = [];

var bounds;
var bounds2;
var bounds3;
var bounds4;
var bounds5;

var cURLEntidad;
var cURLTramites;

$(function () {
    $("#fgeneral").submit(function () {
        buscar_general();
        return false;
    });
    $("#ftramites").submit(function () {
        buscar_tramites();
        return false;
    });
    $("#fservicios").submit(function () {
        buscar_servicios();
        return false;
    });
    $("#fentidades").submit(function () {
        buscar_entidades();
        return false;
    });
})

function openEntidadURL() {
    window.plugins.childBrowser.showWebPage(cURLEntidad, { showLocationBar: true });
}

function openTramitesURL() {
    window.plugins.childBrowser.showWebPage(cURLTramites, { showLocationBar: true });
}

$(document).bind("pagebeforechange", function (event, data) {
    $.mobile.pageData = (data && data.options && data.options.pageData)
        ? data.options.pageData
        : null;
});

$(document).delegate("#detalleEntidad", 'pageshow', function (event) {
    if ($.mobile.pageData && $.mobile.pageData.id) {
        $('#contentdetalleEntidad').hide();
        $('#listadoEntidadView').empty();
        $.mobile.showPageLoadingMsg();
        $.get('http://suit.azurewebsites.net/Suit2.ashx',
               {
                   tipo: "detalleEntidad",
                   query: $.mobile.pageData.id
               },
               function (data) {
                   var list = $('#listadoEntidadView').empty();
                   arr = data.split("\n");
                   if (data == "") {
                       list.listview('refresh');
                       $.mobile.hidePageLoadingMsg();
                       return;
                   }
                   var d = arr[0].split("\t");
                   var pos = 1;
                   var ncount;
                   var tstr;

                   cURLEntidad = "http://suit.azurewebsites.net/FB.aspx?tipo=Entidad&id=" + d[0]
                   $('#fbCommentsEntidad')[0].setAttribute("data-href", cURLEntidad);
                   tstr = '<h2>' + d[2] + '</h2>';
                   tstr += 'NIT: ' + d[1] + '<br />';
                   if (!((d[3] == "") || (d[3] == "NULL"))) {
                       $('#detalleEntidadWeb').show();
                       tstr += 'URL: <a href="' + d[3] + '">' + d[3] + '</a><br />';
                   } else {
                       $('#detalleEntidadWeb').hide();                       
                   }
                   if (!((d[4] == "") || (d[4] == "NULL"))) {
                       $('#detalleEntidadCall').show();
                       tstr += 'Lineas de atenci&oacute;n: <a href=tel:"' + d[4] + '">' + d[4] + '</a><br />';
                   } else {
                       $('#detalleEntidadCall').hide();
                   }
                   if (!((d[5] == "") || (d[5] == "NULL"))) {
                       $('#detalleEntidadMail').show();
                       tstr += 'Quejas y reclamos: <a href="mailto:' + d[5] + '">' + d[5] + '</a><br />';
                   } else {
                       $('#detalleEntidadMail').hide();
                   }
                   if (!((d[6] == "") || (d[6] == "NULL"))) {
                       tstr += 'Clasificaci&oacute;n Organica: ' + d[6] + '<br />';
                   }
                   if (!((d[7] == "") || (d[7] == "NULL"))) {
                       tstr += 'Nivel: ' + d[7] + '<br />';
                   }
                   if (!((d[8] == "") || (d[8] == "NULL"))) {
                       tstr += 'Naturaleza Jur&iacutedica: ' + d[8] + '<br />';
                   }
                   if (!((d[9] == "") || (d[9] == "NULL"))) {
                       tstr += 'Orden Territorial: ' + d[9] + '<br />';
                   }
                   if (!((d[10] == "") || (d[10] == "NULL"))) {
                       tstr += 'Sector: ' + d[10] + '<br />';
                   }
                   tstr += '<br />'
                   $('#entidadEncabezado').html($(tstr));

                   // Tramites
                   ncount = parseInt(arr[pos]);
                   pos++;
                   for (var i = 0; i < ncount; i++) {
                       var d = arr[pos].split("\t");
                       var el = $('<li/>');
                       el.append($('<a href="#detalleTramite?id=' + d[0] + '"><h3>' + d[1] + '</h3><p>' + d[2] + '</p></a>'));
                       list.append(el);
                       pos++;
                   }
                   list.listview('refresh');

                   try {
                       FB.XFBML.parse();
                       $('#comentariosEntidad').hide();
                   } catch (e) {
                       $('#comentariosEntidad').show();	                   
                    }                                      
                   
                   $('#contentdetalleEntidad').show();
                   $.mobile.hidePageLoadingMsg();
               });
    }
});


$(document).delegate("#detalleTramite", 'pageshow', function (event) {
    if ($.mobile.pageData && $.mobile.pageData.id) {
        $('#contentdetalleTramite').hide();
        $('#detalleTitulo').html('');
        $('#detalleDescripcion').html('');
        $('#detalleEncabezado').html('');
        $('#listpasosView').empty();
        $('#listrequisitosView').empty();
        $('#listdocumentosView').empty();
        $('#listpagosView').empty();
        $('#listnormasView').empty();
        $('#puntosatencionView').empty();

        $.mobile.showPageLoadingMsg();
        $.get('http://suit.azurewebsites.net/Suit2.ashx',
               {
                   tipo: "detalleTramite",
                   query: $.mobile.pageData.id,
                   radius: 25,
                   lat: latlng.lat(),
                   lng: latlng.lng()
               },
               function (data) {
                   for (var i = 0; i < markersArray4.length; i++) {
                       markersArray4[i].setMap(null);
                   }
                   arr = data.split("\n");
                   if (data == "") {
                       $.mobile.hidePageLoadingMsg();
                       return;
                   }
                   var d = arr[0].split("\t");
                   var pos = 1;
                   var ncount;

                   cURLTramites = "http://suit.azurewebsites.net/FB.aspx?tipo=Tramite&id=" + d[0];
                   $('#fbCommentsTramites')[0].setAttribute("data-href", cURLTramites);
                   $('#detalleTitulo').html($('<h2>' + d[3] + ': ' + d[1] + '</h2>'));
                   $('#detalleEncabezado').html($('<b>Entidad: </b><a href="#detalleEntidad?id=' + d[5] + '">' + d[6] + '</a>'));
                   $('#detalleDescripcion').html($('<span>' + d[2] + '</span><br /><b>Tramite Electronico: </b><span>' + d[4] + '</span>'));
                   
                   // Pasos
                   ncount = parseInt(arr[pos]);
                   pos++;
                   for (var i = 0; i < ncount; i++) {
                       var d = arr[pos].split("\t");
                       var el = $('<li/>');
                       el.append($('<span style="font-weight: normal;">' + d[0] + '</span>'));
                       $('#listpasosView').append(el);
                       pos++;
                   }
                   $('#listpasosView').listview('refresh');

                   // Requisitos
                   ncount = parseInt(arr[pos]);
                   pos++;
                   for (var i = 0; i < ncount; i++) {
                       var d = arr[pos].split("\t");                       
                       var el = $('<li/>');
                       if (d[0].indexOf("Perfil") != -1) {
                           el = $('<p/>');
                           el.append($('<h3>&nbsp;&nbsp;' + d[0] + '</h3>'));
                       } else {
                           el.append($('<span style="font-weight: normal;">' + d[0] + '</span>'));
                       }
                       $('#listrequisitosView').append(el);
                       pos++;
                   }
                   $('#listrequisitosView').listview('refresh');

                   // Documentos
                   ncount = parseInt(arr[pos]);
                   pos++;
                   for (var i = 0; i < ncount; i++) {
                       var d = arr[pos].split("\t");
                       var el = $('<li/>');
                       if (d[0].indexOf("Perfil") != -1) {
                           el = $('<p/>');
                           el.append($('<h3>&nbsp;&nbsp;' + d[0] + '</h3>'));
                       } else {
                           el.append($('<span style="font-weight: normal;">' + d[0] + '</span>'));
                       }
                       $('#listdocumentosView').append(el);
                       pos++;
                   }
                   $('#listdocumentosView').listview('refresh');

                   // Pagos
                   ncount = parseInt(arr[pos]);
                   pos++;
                   for (var i = 0; i < ncount; i++) {
                       var d = arr[pos].split("\t");
                       var el = $('<li/>');
                       el.append($('<span style="font-weight: normal;">' + d[0] + '</span>'));
                       $('#listpagosView').append(el);
                       pos++;
                   }
                   $('#listpagosView').listview('refresh');

                   // Normas
                   ncount = parseInt(arr[pos]);
                   pos++;
                   for (var i = 0; i < ncount; i++) {
                       var d = arr[pos].split("\t");
                       var el = $('<li/>');
                       el.append($('<span style="font-weight: normal;">' + d[0] + '</span>'));
                       $('#listnormasView').append(el);
                       pos++;
                   }
                   $('#listnormasView').listview('refresh');

                   // Puntos Atencion
                   ncount = parseInt(arr[pos]);
                   pos++;
                   bounds4 = new google.maps.LatLngBounds();
                   bounds4.extend(latlng);
                   for (var i = 0; i < ncount; i++) {
                       var d = arr[pos].split("\t");
                       var el = $('<li/>');
                       el.append($('<span style="font-weight: normal;">' + d[0] + '<br />Direcci&oacute;n: ' + d[2] + '<br />Telefono: ' + d[3] + '<br />Horario: ' + d[4] + '</span><span class="ui-li-count">' + parseFloat(d[1] / 1000).toFixed(2) + 'kms.</span>'));
                       $('#puntosatencionView').append(el);
                       pos++;

                       var infowindow = new google.maps.InfoWindow({
                           content: '<b>' + d[0] + '</b><p>Direcci&oacute;n: ' + d[2] + '</br>Telefono: ' + d[3] + '</br>Horario: ' + d[4] + '</br>'
                       });
                       var pinImage = new google.maps.MarkerImage("images/office-building.png",
                           new google.maps.Size(32, 37));
                       var pinShadow = new google.maps.MarkerImage("images/shadow.png",
                           new google.maps.Size(51, 37));
                       var marker = new google.maps.Marker({
                           position: new google.maps.LatLng(d[5], d[6]),
                           title: d[0],
                           map: map4,
                           icon: pinImage,
                           shadow: pinShadow
                       });
                       bounds4.extend(marker.getPosition());
                       google.maps.event.addListener(marker, 'click', function () {
                           infowindow.open(map4, marker);
                       });
                       markersArray4.push(marker);

                   }
                   $('#mapaLista').trigger("expand");
                   $('#puntosatencionView').listview('refresh');

                   try {
                       FB.XFBML.parse();
                       $('#comentariosTramites').hide();
                   } catch (e) {
                       $('#comentariosTramites').show();
                   }

                   $('#contentdetalleTramite').show();
                   $.mobile.hidePageLoadingMsg();
                   google.maps.event.trigger(map4, 'resize');
                   map4.fitBounds(bounds4);
                   map4.panToBounds(bounds4);
                   
               });
    }
});

function buscar_tramites() {
    $.mobile.changePage("#tramites");
    $('#listadoTramitesView').empty();
    $.mobile.showPageLoadingMsg();
    $.get('http://suit.azurewebsites.net/Suit2.ashx',
           {
               tipo: "tramites",
               query: $('#tramitequery')[0].value,
               loc: $('#tramitelocation')[0].value,
               tema: $('#tramitetema')[0].value,
               radius: 25,
               lat: latlng.lat(),
               lng: latlng.lng()
           },
           function (data) {
               var list = $('#listadoTramitesView');
               for (var i = 0; i < markersArray.length; i++) {
                   markersArray[i].setMap(null);
               }
               var arr = data.split("\n");
               if (data == "") {
                   list.listview('refresh');
                   $.mobile.hidePageLoadingMsg();
                   $("#popupTramites").popup("open");
                   return;
               }
               if ($('#tramitesOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   arr.sort(function (a, b) {
                       var a1 = parseFloat(a.split("\t")[5]);
                       var b1 = parseFloat(b.split("\t")[5]);
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               } else {
                   arr.sort(function (a, b) {
                       var a1 = a.split("\t")[1];
                       var b1 = b.split("\t")[1];
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               };
               bounds = new google.maps.LatLngBounds();
               $.each(arr, function (i, val) {
                   var d = val.split("\t");
                   var el = $('<li/>');
                   if (d[9] != 0) {
                       el.append($('<a href="#detalleTramite?id=' + d[0] + '"><h3>' + d[1] + '</h3><p>' + d[3] + ' - Sede: ' + d[4] + '</p><span class="ui-li-count">' + parseFloat(d[5] / 1000).toFixed(2) + ' kms.</span></a>'));
                   } else {
                       el.append($('<a href="#detalleTramite?id=' + d[0] + '"><h3>' + d[1] + '</h3><p>' + d[3] + ' - Sede: ' + d[4] + '</p></a>'));
                   };
                   list.append(el);

                   var infowindow = new google.maps.InfoWindow({
                       content: '<b>' + d[1] + '</b><p>Entidad: <a href="#detalleEntidad?id=' + d[2] + '">' + d[3] + '</a></br>Sede: ' + d[4] + '</br>Direcci&oacute;n: ' + d[6] + '</br>Telefono: ' + d[7] + '</br>Horario: ' + d[8] + '</br><a href="#detalleTramite?id=' + d[0] + '">Ver detalle</a>'
                   });
                   var pinImage = new google.maps.MarkerImage("images/office-building.png",
                       new google.maps.Size(32, 37));
                   var pinShadow = new google.maps.MarkerImage("images/shadow.png",
                       new google.maps.Size(51, 37));
                   var marker = new google.maps.Marker({
                       position: new google.maps.LatLng(d[9], d[10]),
                       title: d[1],
                       map: map,
                       icon: pinImage,
                       shadow: pinShadow
                   });
                   bounds.extend(marker.getPosition());
                   google.maps.event.addListener(marker, 'click', function () {
                       infowindow.open(map, marker);
                   });
                   markersArray.push(marker);


               });

               list.listview('refresh');
               if ($('#tramitesOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   $('#listadoTramitesView .ui-li-divider').hide();
               } else {
                   $('#listadoTramitesView .ui-li-divider').show();
               }
               $.mobile.hidePageLoadingMsg();

           });
};

function buscar_general() {
    $.mobile.changePage("#general");
    $('#listadoGeneralView').empty();
    $.mobile.showPageLoadingMsg();
    $.get('http://suit.azurewebsites.net/Suit2.ashx',
           {
               tipo: "general",
               query: $('#generalquery')[0].value,
               radius: 25,
               lat: latlng.lat(),
               lng: latlng.lng()
           },
           function (data) {
               var list = $('#listadoGeneralView');
               for (var i = 0; i < markersArray5.length; i++) {
                   markersArray5[i].setMap(null);
               }
               var arr = data.split("\n");
               if (data == "") {
                   list.listview('refresh');
                   $.mobile.hidePageLoadingMsg();
                   $("#popupTramites").popup("open");
                   return;
               }
               if ($('#generalOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   arr.sort(function (a, b) {
                       var a1 = parseFloat(a.split("\t")[5]);
                       var b1 = parseFloat(b.split("\t")[5]);
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               } else {
                   arr.sort(function (a, b) {
                       var a1 = a.split("\t")[1];
                       var b1 = b.split("\t")[1];
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               };
               bounds5 = new google.maps.LatLngBounds();
               $.each(arr, function (i, val) {
                   var d = val.split("\t");
                   var el = $('<li/>');
                   var key;
                   var keyL;
                   var infowindow;
                   if (d[11] == "1") {
                       key = "T";
                       keyL = "detalleTramite";
                       infowindow = new google.maps.InfoWindow({
                           content: '<b>' + d[1] + '</b><p>Entidad: <a href="#detalleEntidad?id=' + d[2] + '">' + d[3] + '</a></br>Sede: ' + d[4] + '</br>Direcci&oacute;n: ' + d[6] + '</br>Telefono: ' + d[7] + '</br>Horario: ' + d[8] + '</br><a href="#' + keyL + '?id=' + d[0] + '">Ver detalle</a>'
                       });
                   };
                   if (d[11] == "2") {
                       key = "S";
                       keyL = "detalleTramite";
                       infowindow = new google.maps.InfoWindow({
                           content: '<b>' + d[1] + '</b><p>Entidad: <a href="#detalleEntidad?id=' + d[2] + '">' + d[3] + '</a></br>Sede: ' + d[4] + '</br>Direcci&oacute;n: ' + d[6] + '</br>Telefono: ' + d[7] + '</br>Horario: ' + d[8] + '</br><a href="#' + keyL + '?id=' + d[0] + '">Ver detalle</a>'
                       });
                   };
                   if (d[11] == "3") {
                       key = "E";
                       keyL = "detalleEntidad";
                       infowindow = new google.maps.InfoWindow({
                           content: '<b>' + d[1] + '</b><p>Entidad: <a href="#detalleEntidad?id=' + d[2] + '">' + d[3] + '</a></br>Sede: ' + d[4] + '</br>Direcci&oacute;n: ' + d[6] + '</br>Telefono: ' + d[7] + '</br>Horario: ' + d[8] + '</br><a href="#' + keyL + '?id=' + d[0] + '">Ver detalle</a>'
                       });
                   };

                   if (d[9] != 0) {
                       el.append($('<a href="#' + keyL + '?id=' + d[0] + '"><img src="images/' + key + '.png"><h3>' + d[1] + '</h3><p>' + d[3] + ' - Sede: ' + d[4] + '</p><span class="ui-li-count">' + parseFloat(d[5] / 1000).toFixed(2) + ' kms.</span></a>'));
                   } else {
                       el.append($('<a href="#' + keyL + '?id=' + d[0] + '"><img src="images/' + key + '.png"><h3>' + d[1] + '</h3><p>' + d[3] + ' - Sede: ' + d[4] + '</p></a>'));
                   };
                   list.append(el);

                   var pinImage = new google.maps.MarkerImage("images/office-building.png",
                       new google.maps.Size(32, 37));
                   var pinShadow = new google.maps.MarkerImage("images/shadow.png",
                       new google.maps.Size(51, 37));
                   var marker = new google.maps.Marker({
                       position: new google.maps.LatLng(d[9], d[10]),
                       title: d[1],
                       map: map5,
                       icon: pinImage,
                       shadow: pinShadow
                   });
                   bounds5.extend(marker.getPosition());
                   google.maps.event.addListener(marker, 'click', function () {
                       infowindow.open(map5, marker);
                   });
                   markersArray5.push(marker);


               });

               list.listview('refresh');
               if ($('#generalOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   $('#listadoGeneralView .ui-li-divider').hide();
               } else {
                   $('#listadoGeneralView .ui-li-divider').show();
               }
               $.mobile.hidePageLoadingMsg();

           });
};

function buscar_servicios() {
    $.mobile.changePage("#servicios");
    $('#listadoServiciosView').empty();
    $.mobile.showPageLoadingMsg();
    $.get('http://suit.azurewebsites.net/Suit2.ashx',
           {
               tipo: "servicios",
               query: $('#servicioquery')[0].value,
               loc: $('#serviciolocation')[0].value,
               tema: $('#serviciotema')[0].value,
               radius: 25,
               lat: latlng.lat(),
               lng: latlng.lng()
           },
           function (data) {
               var list = $('#listadoServiciosView');
               for (var i = 0; i < markersArray3.length; i++) {
                   markersArray3[i].setMap(null);
               }
               var arr = data.split("\n");
               if (data == "") {
                   list.listview('refresh');
                   $.mobile.hidePageLoadingMsg();
                   $("#popupServicios").popup("open");
                   return;
               }
               if ($('#serviciosOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   arr.sort(function (a, b) {
                       var a1 = parseFloat(a.split("\t")[5]);
                       var b1 = parseFloat(b.split("\t")[5]);
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               } else {
                   arr.sort(function (a, b) {
                       var a1 = a.split("\t")[1];
                       var b1 = b.split("\t")[1];
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               };
               bounds3 = new google.maps.LatLngBounds();
               $.each(arr, function (i, val) {
                   var d = val.split("\t");
                   var el = $('<li/>');
                   if (d[9] != 0) {
                       el.append($('<a href="#detalleTramite?id=' + d[0] + '"><h3>' + d[1] + '</h3><p>' + d[3] + ' - Sede: ' + d[4] + '</p><span class="ui-li-count">' + parseFloat(d[5] / 1000).toFixed(2) + ' kms.</span></a>'));
                   } else {
                       el.append($('<a href="#detalleTramite?id=' + d[0] + '"><h3>' + d[1] + '</h3><p>' + d[3] + ' - Sede: ' + d[4] + '</p></a>'));
                   };
                   list.append(el);

                   var infowindow = new google.maps.InfoWindow({
                       content: '<b>' + d[1] + '</b><p>Entidad: <a href="#detalleEntidad?id=' + d[2] + '">' + d[3] + '</a></br>Sede: ' + d[4] + '</br>Direcci&oacute;n: ' + d[6] + '</br>Telefono: ' + d[7] + '</br>Horario: ' + d[8] + '</br><a href="#detalleTramite?id=' + d[0] + '">Ver detalle</a>'
                   });
                   var pinImage = new google.maps.MarkerImage("images/office-building.png",
                       new google.maps.Size(32, 37));
                   var pinShadow = new google.maps.MarkerImage("images/shadow.png",
                       new google.maps.Size(51, 37));
                   var marker = new google.maps.Marker({
                       position: new google.maps.LatLng(d[9], d[10]),
                       title: d[1],
                       map: map3,
                       icon: pinImage,
                       shadow: pinShadow
                   });
                   bounds3.extend(marker.getPosition());
                   google.maps.event.addListener(marker, 'click', function () {
                       infowindow.open(map3, marker);
                   });
                   markersArray3.push(marker);


               });
               list.listview('refresh');
               if ($('#serviciosOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   $('#listadoServiciosView .ui-li-divider').hide();
               } else {
                   $('#listadoServiciosView .ui-li-divider').show();
               }
               $.mobile.hidePageLoadingMsg();

           });
};

function buscar_entidades() {
    $.mobile.changePage("#entidades");
    $('#listadoEntidadesView').empty();
    $.mobile.showPageLoadingMsg();
    $.get('http://suit.azurewebsites.net/Suit2.ashx',
           {
               tipo: "entidades",
               query: $('#entidadquery')[0].value,
               loc: $('#entidadlocation')[0].value,
               sector: $('#entidadsector')[0].value,
               radius: 25,
               lat: latlng.lat(),
               lng: latlng.lng()
           },
           function (data) {
               var list = $('#listadoEntidadesView');
               for (var i = 0; i < markersArray2.length; i++) {
                   markersArray2[i].setMap(null);
               }
               var arr = data.split("\n");
               if (data == "") {
                   list.listview('refresh');
                   $.mobile.hidePageLoadingMsg();
                   $("#popupEntidades").popup("open");
                   return;
               }
               if ($('#entidadesOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   arr.sort(function (a, b) {
                       var a1 = parseFloat(a.split("\t")[3]);
                       var b1 = parseFloat(b.split("\t")[3]);
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               } else {
                   arr.sort(function (a, b) {
                       var a1 = a.split("\t")[1];
                       var b1 = b.split("\t")[1];
                       if (a1 == b1) return 0;
                       return a1 > b1 ? 1 : -1;
                   });
               };
               bounds2 = new google.maps.LatLngBounds();
               $.each(arr, function (i, val) {
                   var d = val.split("\t");
                   var el = $('<li/>');
                   if (d[7] != 0) {
                       el.append($('<a href="#detalleEntidad?id=' + d[0] + '"><h3>' + d[1] + '</h3><p>Sede: ' + d[2] + '</p><span class="ui-li-count">' + parseFloat(d[3] / 1000).toFixed(2) + ' kms.</span></a>'));
                   } else {
                       el.append($('<a href="#detalleEntidad?id=' + d[0] + '"><h3>' + d[1] + '</h3><p>Sede: ' + d[2] + '</p></a>'));
                   }
                   list.append(el);

                   var infowindow = new google.maps.InfoWindow({
                       content: '<b>' + d[1] + '</b><p>' + d[2] + '</br>Direcci&oacute;n: ' + d[4] + '</br>Telefono: ' + d[5] + '</br>Horario: ' + d[6] + '</br><a href="#detalleEntidad?id=' + d[0] + '">Ver detalle</a>'
                   });
                   var pinImage = new google.maps.MarkerImage("images/office-building.png",
                       new google.maps.Size(32, 37));
                   var pinShadow = new google.maps.MarkerImage("images/shadow.png",
                       new google.maps.Size(51, 37));
                   var marker = new google.maps.Marker({
                       position: new google.maps.LatLng(d[7], d[8]),
                       title: d[1],
                       map: map2,
                       icon: pinImage,
                       shadow: pinShadow
                   });
                   bounds2.extend(marker.getPosition());
                   google.maps.event.addListener(marker, 'click', function () {
                       infowindow.open(map2, marker);
                   });
                   markersArray2.push(marker);


               });

               list.listview('refresh');
               if ($('#entidadesOrdenButton .ui-btn-text').text() == "Orden A-Z") {
                   $('#listadoEntidadesView .ui-li-divider').hide();
               } else {
                   $('#listadoEntidadesView .ui-li-divider').show();
               }
               $.mobile.hidePageLoadingMsg();

           });
};


function entidadesOrden() {
    if ($('#entidadesOrdenButton .ui-btn-text').text() == "Orden A-Z") {
        $('#entidadesOrdenButton .ui-btn-text').text("Orden cercania");
    } else {
        $('#entidadesOrdenButton .ui-btn-text').text("Orden A-Z");
    };
    buscar_entidades();
};

function tramitesOrden() {
    if ($('#tramitesOrdenButton .ui-btn-text').text() == "Orden A-Z") {
        $('#tramitesOrdenButton .ui-btn-text').text("Orden cercania");
    } else {
        $('#tramitesOrdenButton .ui-btn-text').text("Orden A-Z");
    };
    buscar_tramites();
};

function serviciosOrden() {
    if ($('#serviciosOrdenButton .ui-btn-text').text() == "Orden A-Z") {
        $('#serviciosOrdenButton .ui-btn-text').text("Orden cercania");
    } else {
        $('#serviciosOrdenButton .ui-btn-text').text("Orden A-Z");
    };
    buscar_servicios();
};

function entidadesOrden() {
    if ($('#entidadesOrdenButton .ui-btn-text').text() == "Orden A-Z") {
        $('#entidadesOrdenButton .ui-btn-text').text("Orden cercania");
    } else {
        $('#entidadesOrdenButton .ui-btn-text').text("Orden A-Z");
    };
    buscar_entidades();
};

function generalOrden() {
    if ($('#generalOrdenButton .ui-btn-text').text() == "Orden A-Z") {
        $('#generalOrdenButton .ui-btn-text').text("Orden cercania");
    } else {
        $('#generalOrdenButton .ui-btn-text').text("Orden A-Z");
    };
    buscar_general();
};

$(document).delegate("#mapaTramites", 'pageshow', function (event) {
    google.maps.event.trigger(map, 'resize');
    map.fitBounds(bounds);
    map.panToBounds(bounds);
});

$(document).delegate("#mapaEntidades", 'pageshow', function (event) {
    google.maps.event.trigger(map2, 'resize');
    map2.fitBounds(bounds2);
    map2.panToBounds(bounds2);
});

$(document).delegate("#mapaServicios", 'pageshow', function (event) {
    google.maps.event.trigger(map3, 'resize');
    map3.fitBounds(bounds3);
    map3.panToBounds(bounds3);
});

$(document).delegate("#mapaGeneral", 'pageshow', function (event) {
    google.maps.event.trigger(map5, 'resize');
    map5.fitBounds(bounds5);
    map5.panToBounds(bounds5);
});

function getGeolocation() {
    latlng = new google.maps.LatLng(
        40.456340, -3.67682);
    var myOptions = {
        zoom: 12,           // zoom level. more value = more details
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapObj = document.getElementById("map_canvas");
    map = new google.maps.Map(mapObj, myOptions);
    google.maps.event.trigger(map, 'resize');

    var mapObj2 = document.getElementById("map_canvas2");
    map2 = new google.maps.Map(mapObj2, myOptions);
    google.maps.event.trigger(map2, 'resize');

    var mapObj3 = document.getElementById("map_canvas3");
    map3 = new google.maps.Map(mapObj3, myOptions);
    google.maps.event.trigger(map3, 'resize');

    var mapObj4 = document.getElementById("map_canvas4");
    map4 = new google.maps.Map(mapObj4, myOptions);
    google.maps.event.trigger(map4, 'resize');

    var mapObj5 = document.getElementById("map_canvas5");
    map5 = new google.maps.Map(mapObj5, myOptions);
    google.maps.event.trigger(map5, 'resize');

    var options = {
        maximumAge: 600000,         // We accept positions whose age is not greater than 10 minutes.
        timeout: 30000,             // if there is no cached position available at all, the user agent
        // will immediately invoke the error callback after "timeout" 30 seconds
        enableHighAccuracy: false   // true, if you need high accuracy
    };
    // when the geolocation is successfully received, loadMap will be fired
    navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
}

function loadMap(position) {
    latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var pinColor = "00FF00";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
    var marker = new google.maps.Marker({
        position: latlng,
        title: "Posicion actual",
        map: map,
        icon: pinImage,
        shadow: pinShadow
    });
    var marker2 = new google.maps.Marker({
        position: latlng,
        title: "Posicion actual",
        map: map2,
        icon: pinImage,
        shadow: pinShadow
    });
    var marker3 = new google.maps.Marker({
        position: latlng,
        title: "Posicion actual",
        map: map3,
        icon: pinImage,
        shadow: pinShadow
    });
    var marker4 = new google.maps.Marker({
        position: latlng,
        title: "Posicion actual",
        map: map4,
        icon: pinImage,
        shadow: pinShadow
    });
    var marker5 = new google.maps.Marker({
        position: latlng,
        title: "Posicion actual",
        map: map5,
        icon: pinImage,
        shadow: pinShadow
    });
    bounds = new google.maps.LatLngBounds();
    bounds.extend(latlng);
    map.setCenter(latlng);
    bounds2 = new google.maps.LatLngBounds();
    bounds2.extend(latlng);
    map2.setCenter(latlng);
    bounds3 = new google.maps.LatLngBounds();
    bounds3.extend(latlng);
    map3.setCenter(latlng);
    bounds4 = new google.maps.LatLngBounds();
    bounds4.extend(latlng);
    map4.setCenter(latlng);
    bounds5 = new google.maps.LatLngBounds();
    bounds5.extend(latlng);
    map5.setCenter(latlng);
}

function geoError(err) {
    console.log("*geoError*");
    alert('code: ' + err.code + '\n' + 'message: ' + err.message + '\n');
}