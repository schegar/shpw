var errorField = $("#error");

    errorField.hide();
    $("#success").hide();

      $(function() {
        $('#login-form-link').click(function(e) {
          $("#login-form").delay(100).fadeIn(100);
          $("#register-form").fadeOut(100);
          $('#register-form-link').removeClass('active');
          $(this).addClass('active');
          e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
          $("#register-form").delay(100).fadeIn(100);
          $("#login-form").fadeOut(100);
          $('#login-form-link').removeClass('active');
          $(this).addClass('active');
          e.preventDefault();
        });
      });

      function login() {
          event.preventDefault();
          var loginDetails = JSON.stringify({
            email: $("#email").val(),
            password: $("#password").val()
          });

          $.ajax({
            url: "/users/login",
            type: "POST",
            data: loginDetails,
            success: function (data, textStatus, request) {
              var token = request.getResponseHeader("Auth");
              Cookies.set("Auth", token);
              window.location = "/index.html"
            },
            contentType: "application/json",
            dataType: "json"
          });
      }

      function register() {
          event.preventDefault();

          var error = "";

          var password = $("#register-password").val();
          var cpassword = $("#register-confirm-password").val();

          if (password.localeCompare(cpassword) !== 0) {
            showError("Your passwords didn't match!");
          } else {

            var registerDetails = JSON.stringify({
              email: $("#register-email").val(),
              password: password
            });

            $.ajax({
              url: "/users",
              type: "POST",
              data: registerDetails,
              success: function (data, textStatus, request) {
                $("#success").show();
              },
              error: function (xhr) {
                var response = JSON.parse(xhr.responseText)
                showError(response.errors[0].message);
              },
              contentType: "application/json",
              dataType: "json"
            });
          }
      }

      function showError(error) {
        console.log(error);
        $("#errorValue").text(error);
        errorField.show();
      }