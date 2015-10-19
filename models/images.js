Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "bebe-uploads"})]
  // stores: [new FS.Store.GridFS("images", {})]
});

Images.allow({
  insert:function(userId,project){
    return true;
  },
  update:function(userId,project,fields,modifier){
    return true;
  },
  remove:function(userId,project){
    return true;
  },
  download:function(){
    return true;
  }
});
