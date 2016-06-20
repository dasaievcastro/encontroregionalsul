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
    }
};

app.initialize();


function readFile() {
   var type = window.PERSISTENT;
   var size = 5*1024*1024;

   window.requestFileSystem(type, size, successCallback, errorCallback)

   function successCallback(fs) {

      fs.root.getFile('data/palestrantes.json', {}, function(fileEntry) {

         fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
               //var txtArea = document.getElementById('textarea');
               var a = JSON.parse(this.result);
               r = 0;
               //for(r in a){
                function recursive(r){
                var row = a[r];

                readImage(row.foto,function(resposta){

                  html = criarbloco(row, resposta)
                  r++;
                  $('#conteudopalestrantes').append(html)
                  if(r<a.length){
                    recursive(r)
                  }else{http://192.168.201.39:3000/palestrantes.html#
                     $(".preload-image").lazyload({
                        threshold : 100,
                        effect : "fadeIn",
                        container: $("#page-content-scroll")
                    });
                    $('.show-wide-text').click(function(){
                        $(this).parent().find('.wide-text').slideToggle(200); 
                        return false;
                    });
                    $('.portfolio-close').click(function(){
                       $(this).parent().parent().find('.wide-text').slideToggle(200);
                        return false;
                    });
                    $("#status").fadeOut(); // will first fade out the loading animation
                    $("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.
                    clickpalestrante();
                  }
                  

                })
               }
                recursive(r); 
            };

            reader.readAsText(file);

         }, errorCallback);

      }, errorCallback);
   }

    function errorCallback(error) {
      $('#notificacao').delay(450).fadeIn("medium").delay(3500).fadeOut("slow")
      $("#status").fadeOut(); // will first fade out the loading animation
                    $("#preloader").delay(350).fadeOut("slow");
   }
    
}

function readImage(arquivo,retorno){
  var type = LocalFileSystem.PERSISTENT;
  var size = 0;
  var url = "http://gama-ca.com.br/appsulatuarios/imagens/"+arquivo;
  var urlarquivo ="imagens/"+arquivo
  window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {

      fs.root.getFile(urlarquivo, {}, function(fileEntry) {

         fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
               retorno(e.target.result);
            };
            reader.readAsDataURL(file)
            

         }, errorCallback);

        }, errorCallback);
    }

    function errorCallback(error) {
      var networkState = navigator.connection.type;
      if (networkState !== Connection.NONE) {
        download(url,"imagens",arquivo)
      }
      retorno("images/pictures/iconpalestrante.png")
    }

}

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

        fp = fp + "/" + Folder_Name + "/" + File_Name ; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent) {
        // Directory created successfuly
        //alert("achei")
    }

    function onDirectoryFail(error) {
        //Error while creating directory
       // alert("Unable to create new directory: " + error.code);
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
                     //alert("upload error code" + error.code);
                 }
            );
}

function criarbloco(row, imagem){

        return '<div id="'+row.id+'" class="portfolio-item"><a href="#" class="wide-title show-wide-text"><h3 class="nomep">'+row.nome+'</h3><em class="nomep">'+row.palestra+'</em><div></div><img src="images/pictures/fundo.jpg" alt="img"></a><div class="wide-text"><p><img src="'+imagem+'" alt="img">'+row.texto+'</p><a href="#" class="portfolio-close"><i class="fa fa-times"></i>Fechar</a><div class="clear"></div></div></div>'
   
}
function clickpalestrante(){
  url = document.URL;
  if(url.indexOf('#')>=0){
    id = url.split("#")[1];
    $('#'+id+' .show-wide-text').delay(2000).trigger('click');
      $('#page-content-scroll').animate({
        scrollTop: $("#"+id).offset().top-60
    }, 2000);
  }
}