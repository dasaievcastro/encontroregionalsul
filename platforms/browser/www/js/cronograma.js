/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("online", onOnline, false);

        function onOnline() {
            download("http://gama-ca.com.br/appsulatuarios/data/palestrantes.json", "data", "palestrantes");
            download("http://gama-ca.com.br/appsulatuarios/data/cronograma.json", "data", "cronograma");
            download("http://gama-ca.com.br/appsulatuarios/data/maisinformacoes.json", "data", "maisinformacoes");
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //document.getElementById("uploadFile").addEventListener("click", uploadFile);
        //jcodes()
        //alert('as')
        //download("http://gama-ca.com.br/wp-content/uploads/2013/09/icone-logo-gama.png", "imagens", "testes");
        //readImage("/imagens/testes.png")

        readFile()
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        $("#status").fadeOut(); // will first fade out the loading animation
        $("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.
    }
};

app.initialize();


function readFile() {
   var type = window.PERSISTENT;
   var size = 5*1024*1024;

   window.requestFileSystem(type, size, successCallback, errorCallback)

   function successCallback(fs) {

      fs.root.getFile('data/cronograma.json', {}, function(fileEntry) {

         fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
               //var txtArea = document.getElementById('textarea');
               a = JSON.parse(this.result);
               var rf = 0
               for(r in a){
                
                var rowp = a[r];
                var html = '';
                  for(r2 in rowp){
                    var rowp2 = rowp[r2]


                    html += criarbloco(rowp2)
                    
                   
                  }
                  rf++;
                   $('#conteudocronograma'+rf).html(html)
                }
            };

            reader.readAsText(file);

         }, errorCallback);

      }, errorCallback);
   }

    function errorCallback(error) {
      $('#notificacao').delay(450).fadeIn("medium").delay(3500).fadeOut("slow")
      //alert("Não foi possível ler o arquivo")
   }
    
}



function criarbloco(row){

  var retorno = ''
  if(row.nomep == ''){
    retorno = '<div class="calendar-hours"><a class="calendar-hour calendar-hour-taken"><strong class="cal-from">'+row.horarioi+'</strong><strong class="cal-to">'+row.horariof+'</strong><h4 class="espacoagenda">'+row.palestra+'</h4></a></div>'  
    if(row.child!=undefined){
      retorno = '<div class="calendar-hours child"><a class="calendar-hour calendar-hour-taken"><strong class="cal-from">'+row.horarioi+'</strong><strong class="cal-to">'+row.horariof+'</strong><h4 class="espacoagenda">'+row.palestra+'</h4></a></div>'   
      if(row.palestra.indexOf('Perguntas')>=0){
        retorno = '<div class="calendar-hours child"><a href="duvidas.html" class="calendar-hour calendar-hour-taken"><strong class="cal-from">'+row.horarioi+'</strong><strong class="cal-to">'+row.horariof+'</strong><h4>'+row.palestra+'</h4><em><span class="facasuaperguntapainel">Clique aqui e faça a sua pergunta</span></em></a></div>'   

      }
    }
  }else{
    retorno = '<div class="calendar-hours"><a  href="palestrantes.html#'+row.link+'" class="calendar-hour calendar-hour-taken"><strong class="cal-from">'+row.horarioi+'</strong><strong class="cal-to">'+row.horariof+'</strong><h4>'+row.palestra+'</h4><em><i class="fa fa-user"></i>'+row.nomep+'</em></a></div>'   
    if(row.child!=undefined){
      retorno = '<div class="calendar-hours child"><a  href="palestrantes.html#'+row.link+'" class="calendar-hour calendar-hour-taken"><strong class="cal-from">'+row.horarioi+'</strong><strong class="cal-to">'+row.horariof+'</strong><h4>'+row.palestra+'</h4><em><i class="fa fa-user"></i>'+row.nomep+'</em></a></div>'   

    }
    if(String(row.palestra).indexOf('Painel')>=0){
      retorno = '<div class="calendar-hours painel"><a  href="palestrantes.html#'+row.link+'" class="calendar-hour calendar-hour-taken"><strong class="cal-from">'+row.horarioi+'</strong><strong class="cal-to">'+row.horariof+'</strong><h4>'+row.palestra+'</h4><em><i class="fa fa-user-plus"></i>'+row.nomep+'</em></a></div>'   
    }  
  }
  return retorno
}



jQuery(document).ready(function($){
  $(document.body).on('click', '.diaevento', function(){

    //mudar as cores dos botoes
    $('.botao6').removeClass('button-verde').addClass('button-grey')
    $('.botao7').removeClass('button-yellow').addClass('button-grey')
    $('.botao8').removeClass('button-red').addClass('button-grey')

    //exibindo conteudo dia palestra
    $('.conteudoscronograma').addClass('invisible')
    var textoclick = $(this).text()
    if(textoclick == 6){
      $('#conteudocronograma1').removeClass('invisible')
      $('.botao6').removeClass('button-grey').addClass('button-verde')
    }
    if(textoclick == 7){
      $('#conteudocronograma2').removeClass('invisible')
      $('.botao7').removeClass('button-grey').addClass('button-yellow')
    }
    if(textoclick == 8){
      $('#conteudocronograma3').removeClass('invisible')
      $('.botao8').removeClass('button-grey').removeClass('button-grey').addClass('button-red')
    }

  });
})

function download(URL, Folder_Name, File_Name) {
//step to request a file system 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem) {
        var download_link = encodeURI(URL);
        ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

        var directoryEntry = fileSystem.root; // to get root path of directory
        directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
        var rootdir = fileSystem.root;
        var fp = rootdir.toURL();  // Returns Fulpath of local directory

        fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent) {
        // Directory created successfuly
        //alert("achei")
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        //alert("Unable to create new directory: " + error.code);
    }

    function fileSystemFail(evt) {
        //Unable to access file system
        //alert(evt.target.error.code);
     }
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    fileTransfer.download(download_link, fp,
            function (entry) {
                //alert("download complete: " + entry.fullPath);
            },
         function (error) {
             //Download abort errors or download failed errors
             //alert("download error source " + error.source);
             //alert("download error target " + error.target);
            // alert("upload error code" + error.code);
         }
    );
}