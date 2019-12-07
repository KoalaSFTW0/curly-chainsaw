import * as requester from './requester.js';
import * as shared from './shared.js';

const app = Sammy('body', function()
{
    this.use('Handlebars','hbs');

    this.get('/', function(ctx)
    {
        shared.setHeaderInfo(ctx);
        const partials = shared.getPartials();
        if(ctx.isAuth)
        {
            get('appdata', 'treks', 'Kinvey')
            .then((treks)=> {
                ctx.treks = treks;

                this.loadPartials(partials)
                .partial('./views/home.hbs');
            });
        }
        else
        {
            this.loadPartials(partials)
            .partial('./views/home.hbs');
        }
    });
    this.get('/register', function(ctx){
        shared.setHeaderInfo(ctx);
        const partials = shared.getPartials();
        this.loadPartials(partials)
        .partial('./views/auth/register.hbs');
    });
    this.post('/register',function(ctx){
        const{username, password, repassword} = ctx.params;
    
        if(username.length()>=3 && password.length()>=6 && password == repassword)
        {
            post('user', '', {username,password}, 'Basic')
            .then((userInfo) => {
                saveAuthInfo(userInfo);
                ctx.redirect('/');
            })
            .catch(console.error);
        }
    });
});
app.run();
