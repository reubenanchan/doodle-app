const { query } = require('express');
const express = require('express');
const newConnection = require('./DBConnection'); 

const app = express();

//timeslots created by admin
let option1, option2, option3, option4, option5, option6, option7, option8, option9, option10;

//Display login home page
app.get('/', (req, res) => {
    let content = 
    `<body>
        <h1> Welcome to a Scheduling App! </h1>
        <h4> Log-in as Admin </h4>
        <form action='/login' method='get'>
            Username: &emsp; <input name='usr' type ='text'/>
            <br/>
            Password: &emsp; <input name='pwd' type='text'/>
            <br/>
            <input value="Login" type="submit"/>
            <br/>
        </form>
        <form action='/guestpage'>
            <h4> Log-in as Guest </h4>
            <input value="Guest" type="submit"/>
        </form>
    </body>
    `;

    res.send(content);
});

//Admin page
app.get('/login', (req,res) =>{
    let userName = req.query.usr;
    let password = req.query.pwd;
    //wrong username or password
    content =`
    <body>
        <form action='/' method='get'>
        Access Denied! <input value="Home" type="submit">
        </form>
    </body>
    `
    //right username and password
    if(userName == 'admin' && password == '123'){
        content =`
        <h2> Select poll times </h2>
        <form action='/timeslotsubmit' method='get'>
        <div>
        <div> Times </div>`   
        content +=`<div> </div>`
        for (num=1;num<=9;num++){
            content += `<div>` + num + `</div>`
            content += `<div> <input type="time" name='t` + num + `'/> <input type="time" name='t` + num*11 +`'/> </div>`
        } 
        content += `
        <div>` + 10 + `</div>
        <div> <input type="time" name='t10'/> <input type="time" name='t100'/> </div>
                <input type="submit">
        </div>
        </form>
        <form action='/schedule'>
            <input value="View Submission" type="submit">
        </form>
        `
    }
    
    res.send(content);
});

//guest page
app.get('/guestpage', (req,res) =>{
    
    //display timeslots
    let content= `
    <h2> Select times available </h2>
    <form action='/goschedule' method='get'>
    <div>
    <div> Timeslots </div> <div>${option1}</div <div><input type="checkbox" name='t1' value="1"/></div>> 
                                             <div>${option2}</div <div><input type="checkbox" name='t2' value="1"/></div>> 
                                             <div>${option3}</div <div><input type="checkbox" name='t3' value="1"/></div>> 
                                             <div>${option4}</div <div><input type="checkbox" name='t4' value="1"/></div>> 
                                             <div>${option5}</div <div><input type="checkbox" name='t5' value="1"/></div>> 
                                             <div>${option6}</div <div><input type="checkbox" name='t6' value="1"/></div>> 
                                             <div>${option7}</div <div><input type="checkbox" name='t7' value="1"/></div>> 
                                             <div>${option8}</div <div><input type="checkbox" name='t8' value="1"/></div>> 
                                             <div>${option9}</div <div><input type="checkbox" name='t9' value="1"/></div>> 
                                             <div>${option10}</div <div><input type="checkbox" name='t10' value="1"/></div>>
    <div >Name: <input name='name'/> </div>
    <input value="Save" type="submit">
        
    </div>
    </form>
    <form action='/schedule'>
            <input value="View Submission" type="submit">
    </form>`
    
    
    res.send(content);
    

});

//Initializing Database tables
let conn = newConnection();
conn.connect();
conn.query(`Drop Table Schedule`,
                (err,rows,fields) => {
                    console.log('Table Dropped');
                }
            )

conn.query(`CREATE TABLE Schedule
            (
                Name varchar(20),
                Time1   Bool, 
                Time2   Bool,
                Time3   Bool,
                Time4   Bool,
                Time5   Bool,
                Time6   Bool,
                Time7   Bool,
                Time8   Bool,
                Time9   Bool,
                Time10   Bool
            )
            ` 
            , (err,rows,fields) => {
                console.log('Table Created');
            })
conn.end();


//Registers the admins submissions
app.get('/timeslotsubmit', (req,res) =>{

    option1 = req.query.t1 + ' - ' + req.query.t11;
    option2 = req.query.t2 + ' - ' + req.query.t22;
    option3 = req.query.t3 + ' - ' + req.query.t33;
    option4 = req.query.t4 + ' - ' + req.query.t44;
    option5 = req.query.t5 + ' - ' + req.query.t55;
    option6 = req.query.t6 + ' - ' + req.query.t66;
    option7 = req.query.t7 + ' - ' + req.query.t77;
    option8 = req.query.t8 + ' - ' + req.query.t88;
    option9 = req.query.t9 + ' - ' + req.query.t99;
    option10 = req.query.t10 + ' - ' + req.query.t100;
    res.redirect('/');

});


//guest submissions are added to the database
app.get('/goschedule', (req,res) =>{

    //gets set by a 1 or 0 based on guests submission
    let time1 = req.query.t1 || 0;
    let time2 = req.query.t2 || 0;
    let time3 = req.query.t3 || 0;
    let time4 = req.query.t4 || 0;
    let time5 = req.query.t5 || 0;
    let time6 = req.query.t6 || 0;
    let time7 = req.query.t7 || 0;
    let time8 = req.query.t8 || 0;
    let time9 = req.query.t9 || 0;
    let time10 = req.query.t10 || 0;
    //mysql statment to insert the data into the db
    if(req.query.name != null && req.query.name != ''){
        let connection = newConnection();
        connection.connect();
        connection.query(`insert into Schedule values ("${req.query.name}", ${time1}, ${time2}, ${time3}, ${time4}, ${time5}, ${time6}, ${time7}, ${time8}, ${time9}, ${time10})`
                ,(err,rows,fields) => {  
                    res.redirect('/schedule');
                });
        connection.end();
    }


});

//schedule page
app.get('/schedule', (req,res) =>{
    let scheduleList;
    let connection=newConnection();
    //Initializes the page with the timeslots
    let content =`  <style>
                        .grid-container {
                            display: inline-grid;
                            grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto;
                            background-color: #f35221;
                        }
      
                        .grid-item {
                            background-color: rgba(255, 255, 255, 0.8);
                            border: 1px solid rgba(0, 0, 0, 0.8);
                            padding: 20px;
                            font-size: 20px;
                            text-align: center;
                          }
                        
                    </style>
                    <div class="grid-container">
                    <div class="grid-item"> Submissions </div> <div class="grid-item">${option1}</div> <div class="grid-item">${option2}</div> <div class="grid-item">${option3}</div> <div class="grid-item">${option4}</div> <div class="grid-item">${option5}</div> <div class="grid-item">${option6}</div> <div class="grid-item">${option7}</div> <div class="grid-item">${option8}</div> <div class="grid-item">${option9}</div> <div class="grid-item">${option10}</div>
                    \n`;

    connection.connect();

    //mysql query to pull each row of data from the table and puts it in array.
    connection.query('select * from Schedule', (err,rows,fields) => {
        
        if (err)
            response.send('ERROR: ' +err)
        else
        {
            scheduleList = rows;

            for (u of scheduleList)
                {
                   let t1,t2,t3,t4,t5,t6,t7,t8,t9,t10;
                   if(u.Time1 == 1) t1 = "checked";
                   if(u.Time2 == 1) t2 = "checked";
                   if(u.Time3 == 1) t3 = "checked";
                   if(u.Time4 == 1) t4 = "checked";
                   if(u.Time5 == 1) t5 = "checked";
                   if(u.Time6 == 1) t6 = "checked";
                   if(u.Time7 == 1) t7 = "checked";
                   if(u.Time8 == 1) t8 = "checked";
                   if(u.Time9 == 1) t9 = "checked";
                   if(u.Time10 == 1) t10 = "checked";

                    content+=`
                    <div class="grid-item">${u.Name}:</div> <div class="grid-item"> <input type="checkbox" onclick="return false" ${t1}> </div>
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t2}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t3}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t4}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t5}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t6}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t7}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t8}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t9}> </div> 
                                                            <div class="grid-item"> <input type="checkbox" onclick="return false" ${t10}> </div>
                    \n
                    `
                }
            content += `
                        <form action='/' method='get'>
                            <input Value="Home" type="submit">
                        </form>
                        <div>
                        `
            res.send(content);
        }
    });
    connection.end();
    
});


app.listen(80);
