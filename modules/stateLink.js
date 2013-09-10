exports.init = function(username) {
   /*
    function init() {
        return obj;
    };
   */
  
    var url = "/login"
    ,   copy = "Log in"
    ;

    if (username) {
      url = "/logout";
      copy = "Log out";
    } 

    return {
      url: url,
      copy: copy
    };

};

