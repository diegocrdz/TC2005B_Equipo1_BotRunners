/*
prueba de generación random de enemigos / objetos
*/

class Object //todos los objetos del juego
{
    constructor(type, name)
    {
        this.type = type;
        this.name = name;
    }
}
 
class Character extends Object //personajes (?)
{
    constructor(type, name, health, damage, experience)
    {
        super(type, name);
        this .health = health;
        this.damage = damage;
        this.experience = experience;
    }

    attack()
    {

    }

    receiveDamage()
    {

    }
}

class Enemy extends Character
{

    constructor(type, name , health, damage, experience)
    {
       super(type, name, health, damage, experience)
       this.tipos_enemigos = ["normal", "pesado", "volador"];
       if(!this.tipos_enemigos.includes(type))
       {
            console.log("Tipo de enemigo invalido, los tipos permitidos son: ", tipos_enemigos);
       }
       
    }
}

class Player extends Character
{
    constructor(type, name, health, damage, experience)
    {
        super(type, name, health, damage, experience)
    }
}

//creacion de los objetos

function randomGeneration()
{
    let probabilities  = {normal: 0.4, pesado: 0.3, volador: 0.2};
    let random = Math.random();
    let type;

    if(random < probabilities.normal)
    {
        type = "normal";
    }
    else if (random < probabilities.normal + probabilities.pesado)
    {
        type = "pesado";
    }
    else
    {
        type = "volador";
    }

    let stats = 
    {
        normal : {health: 100, damage: 20, name: "Normalin", experience: 15},
        pesado : {health: 150, damage: 25, name: "Pesadin", experience: 20},
        volador: {health : 75, damage: 15, name: "Voladin", experience: 10} //tdv no esta bien puesto lo de los cambios entre niveles y asi
        //normal moderado todo, pesado alto todo, volador bajo todo
    }

    return new Enemy(type, stats[type].name, stats[type].health, stats[type]. damage, stats[type].experience);

}

function generateEnemies()
{
    let enemyNumber = Math.floor(Math.random() * 5) + 1; //max pueden ser 5 enemigos, +1 porque random genera decimales del 0.1 al 0.99, y con el mathfloor redondea hacia abajo y nunca llegaría al 5 sin el +1
    let enemies = [];

    for(let i = 0; i < enemyNumber; i++)
    {
        enemies.push(randomGeneration());
    }

    return enemies;
}

//probar codigo
let room = generateEnemies();
console.log("Enemigos en el cuarto:");
for(let i = 0; i <room.length; i++)
{
    let enemy  = room[i]; //para ver todos los enemigos en el arreglo
    console.log("Enemigo ", i, ".", enemy.type)
}

