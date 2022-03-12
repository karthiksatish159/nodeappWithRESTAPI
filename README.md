# nodeappWithRESTAPI
<h1>This my first application with nodejs based on api's</h1>
<h4>And i implemented all http methods and i am bulid my webservices according to REST rules and you can grab those web services using backed in REST i.e api's of REST</h4>
<p>Also named as RESTapi or RESTfullApi's</p>
<h3>Webservice</h3>
<p>Webservices are used to do interaction b/w the two different plaforms or application or anything</p>
<p>Webdescription language i used is JSON</p>
<p>
  In this app i used the passport-jwt to authorize the every susequent request of user.To authorize we have to write a strategy by using methods of passport-jwt.
  so to do authorization,We need a something like anchor point that is jwt-token.So using this token we authorize the user.
  The process:
--------------
 
</p>
<ul>
  <li>  1)When ever user login with correct credtinals then we create a token using jsonwebtoken middleware which provided by npm



  </li>
  npm install jsonwebtoken
  <li>2)So there is method sign(),By using this method we are able to create our token.</li>
  <li>3)So before creating a token we must know the  jwt token strcture
      ->The jwt token contains 3 parts that are
          1)header
          2)payload
          3)signature</li>
 <li>4)So the whole process depends upon these three things</li>
<li> 5)So payload is body part here we put the mostly user id and sometimes email and it is a object literal</li>
<li> 6)so in sign() method you have to pass the 4 paramters 1st is payload,2nd is secret,3rd expriresIn,4th is callback</li>
 <li>7)After successful authentication we create the token</li>
<li> 8)So after user landed into the home page now for every subsequent request we have to check the user by using passport.authenticate() method</li>
 <li>9)In this method we pass 2 paramters i.e 1st strategy name,So here we are applying the jwt strategy so we pass 'jwt' and second one is {session:false}</li>
<li> 10)You set { session: false } because you do not want to store the user details in a session. You expect the user to send the token on each request to the secure routes.</li>
 <li>11)So in passport.authenticate() method we extract the token from the headers of http or else we can go with cookie.So here is method verify that wheather logined user is 
    requesting or not,if he/she is the person then it will allow the person or else it simple throws the 401 status i.e unauthorized user</li>
</ul>

