function createFile(data) {
   var type = window.PERSISTENT;
   var size = 5*1024*1024;

   window.requestFileSystem(type, size, successCallback, errorCallback)

   function successCallback(fs) {
      fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
         fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
               //alert('Write completed.');
               //teste()
            };

            fileWriter.onerror = function(e) {
               //alert('Write failed: ' + e.toString());
            };

            var blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});
            fileWriter.write(blob);
         }, errorCallback);
      }, errorCallback);
   }

    function errorCallback(error) {
      console.log("ERROR: " + error)
   }
    
}

function readFile() {
   var type = window.PERSISTENT;
   var size = 5*1024*1024;

   window.requestFileSystem(type, size, successCallback, errorCallback)

   function successCallback(fs) {

      fs.root.getFile('logs.txt', {}, function(fileEntry) {

         fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
               //var txtArea = document.getElementById('textarea');
               a = JSON.parse(this.result);
               for(r in a){
                  var row = a[r];
                  alert(row.id)
               }
            };

            reader.readAsText(file);

         }, errorCallback);

      }, errorCallback);
   }

    function errorCallback(error) {
      alert("Não foi possível ler o arquivo")
   }
    
}