# **Overclocked** :robot::wrench::zap:

## _Documento de Diseño de Videojuego_ :video_game:
### _Game Design Document_


![Logo Tec](img/logo_tec.png)
>*Logo del Tecnológico de Monterrey*

![Logo de Overclocked](img/logo_overclocked.png)
>*Logo de Overclocked*

---

##### **Aviso de derechos de autor / información del autor** :warning:

Este videojuego ha sido desarrollado  a lo largo del semestre febrero-junio de 2025 como parte de la materia TC2005B: Construcción de software y toma de decisiones en el Tecnológico de Monterrey, Campus Santa Fe.

**Profesores:** :mortar_board:
- **Desarrollo de videojuegos:** Gilberto Echeverría Furió
- **Desarrollo Web:** Octavio Navarro Hinojosa
- **Base de datos, Análisis y modelación de sistemas de software:** Esteban Castillo Juarez

**Autores del videojuego - Equipo BotRunners** :robot:
- Diego Córdova Rodríguez, A01781166
- Lorena Estefanía Chewtat Torres, A01785378
- Eder Jezrael Cantero Moreno, A01785888

## :bookmark_tabs: _Índice_

---

1. [Índice](#índice)
2. [Diseño del juego](#diseño-del-juego)
    1. [Resumen](#Resumen)
    2. [Jugabilidad](#jugabilidad)
    3. [Mentalidad](#mentalidad)
3. [Técnico](#técnico)
    1. [Pantallas](#pantallas)
    2. [Controles](#controles)
    3. [Mecánicas](#mecánicas)
4. [Diseño de niveles](#diseño-de-niveles)
    1. [Temas](#temas)
    2. [Estructura de niveles](#estructura-de-niveles)
    2. [Retos](#retos)
    2. [Game Flow](#game-flow)
5. [Desarrollo](#desarrollo)
    1. [Clases abstractas](#clases-abstractas--componentes)
    2. [Clases derivadas](#clases-derivadas--composiciones-de-componentes)
6. [Gráficos](#gráficos)
    1. [Atributos de estilo](#atributos-de-estilo)
    2. [Gráficos necesarios](#gráficos-necesarios)
7. [Sonido/Música](#sonidomúsica)
    1. [Atributos de estilo](#atributos-de-estilo-1)
    2. [Sonidos necesarios](#sonidos-necesarios)
    3. [Música necesaria](#música-necesaria)
8. [Ilustraciones](#ilustraciones)
    1. [Personaje principal](#personaje-principal)
    2. [Enemigos](#enemigos)
    3. [Niveles](#niveles)
    4. [Items](#items)
    5. [Elementos GUI](#elementos-gui)
    5. [Pantallas](#pantallas-1)
9. [Lista de assets](#lista-de-assets)
    1. [Gráficos](#gráficos-1)
    2. [Audio](#audio)
10. [Cronograma](#cronograma)

## _Diseño del juego_

---

### **Resumen**

[Sum up your game idea in 2 sentences. A kind of elevator pitch. Keep it simple!]: #

Overclocked es roguelite de acción en 2D donde encarnas un robot en una competencia de robótica. Explora mapas generados aleatoriamente, derrota rivales mecánicos en combate cuerpo a cuerpo o a distancia y encuentra el botón que activa la sala del jefe final.

Cada victoria te otorga puntos de experiencia para subir de nivel y desbloquear mejoras aleatorias para potenciar tus estadísticas de fuerza, resistencia, velocidad o habilidades de movimiento. Tras completar cada uno de los 3 niveles, desbloqueas armas permanentes que te permitirán reducir el tiempo en el que terminas el juego, ¿Tienes la habilidad para ser el mejor en la competencia de robots?

### **Jugabilidad**

[What should the gameplay be like? What is the goal of the game, and what kind of obstacles are in the way? What tactics should the player use to overcome them?]: #

**Descripción del juego**

Overclocked es un juego que incentiva a los jugadores a completar el juego en el menor tiempo posible. El jugador encarna un pequeño robot llamado “Skippy”, quien cuenta con un brazo robótico como arma inicial para enfrentarse a los demás robots de la competencia.

El jugador inicia el videojuego en una sala rectangular de fondo blanco, con un letrero en la pared que indica los controles de movimiento con las teclas “W,A,S,D”. De igual forma, hay un letrero con una flecha hacia la izquierda, guiando al jugador a avanzar en esa dirección.

Al avanzar, el jugador se encuentra con un robot enemigo de categoría Normal (salud y daño equilibrado). En la pared de esta sala, se encuentra un letrero que indica los controles de ataque cuerpo a cuerpo con la tecla “1” y “flecha derecha/izquierda” para atacar.

De esta forma, el jugador continúa avanzando por las salas con obstáculos y enemigos generados de forma aleatoria. El jugador puede encontrarse con enemigos de categoría Normal (salud y daño equilibrado), Pesado (salud y daño elevado) y Aéreo (salud y daño bajo).

El jugador debe explorar las salas del nivel hasta encontrar una que contenga un botón azul. Al acercarse, el botón se activa automáticamente, desbloqueando la sala final del nivel, en donde el jugador deberá enfrentarse a un jefe final.

Cada vez que el jugador derrota enemigos, obtiene una bonificación de experiencia, haciendo que cada vez que suba de nivel pueda seleccionar una mejora de estadísticas (salud, daño, protección) o movilidad (doble salto, esquivar (dash)). Al derrotar al jefe final de los niveles, el jugador obtiene un arma permanente que modifica su estadística base de daño.

**Objetivo del juego**

El objetivo principal del juego es que el jugador complete cada uno de los 3 niveles en el menor tiempo posible, lo que implica dominar las mecánicas del juego y obtener cada una de las armas permanentes posibles tras derrotar a cada jefe de los niveles. De esta forma, el juego invita a que los jugadores optimicen su forma de juego para ser más veloces en cada intento, así como los invita a utilizar diferentes estrategias para completar el juego.

**Obstáculos y Retos**

Cada nivel cuenta con tres variaciones de enemigos, mismos que cuentan con distintas estadísticas de salud y daño:
- Robot Normal: Salud - 50 puntos, Daño - 20%
- Robot Pesado: Salud - 75 puntos, Daño - 40%
- Robot Aéreo: Salud - 25 puntos, Daño - 10%

Adicionalmente, el juego cuenta con 3 tipos de obstáculos:
- Cajas de mader/metal (bloquean el paso del jugador/enemigos)
- Picos de metal (dañan al jugador si este se acerca)
- Tuberías de metal (bloquean el paso del jugador/enemigos)

Además, el juego fomenta ser completado en el menor tiempo posible, por lo que el contador de tiempo representa un reto al cual ser vencido. La generación aleatoria de mapas y opciones de habilidades temporales (escogiendo una habilidad de tres después de subir de nivel) fomenta la estrategia y planeación de parte del jugador.

**Tácticas para completar el juego**

- **Dominar las mecánicas del juego:** Los jugadores deben aprender a utilizar el movimiento del personaje a su favor, aprovechando habilidades como el doble salto y esquivar (dash).
- **Aprender patrones de los niveles:** Tras un par de intentos, los jugadores pueden empezar a detectar patrones en la generación de niveles, lo que los puede llevar a optimizar sus rutas o estrategias para derrotar a los enemigos de forma eficaz.
- **Combate agresivo:** Si los jugadores logran adoptar una forma de combate agresiva, pueden lograr un menor tiempo para completar el juego a la vez que suben más niveles y desbloquean mejores habilidades.
- **Decisiones estratégicas:** Probar diferentes combinaciones de habilidades al momento de subir niveles. Esto permite que cada jugador tenga una experiencia diferente de juego y optimicen su forma ideal de jugar.

### **Mentalidad**

[What kind of mindset do you want to provoke in the player? Do you want them to feel powerful, or weak? Adventurous, or nervous? Hurried, or calm? How do you intend to provoke those emotions?]: #

Overclocked -al igual que una competencia de robótica- fomenta la competitividad, donde solo los mejores son reconocidos por su esfuerzo. De esta forma, el juego busca que los jugadores tengan un deseo por explorar y navegar rápidamente los niveles, en un tiempo no mayor a 5 minutos por cada uno. El juego busca provocar un ambiente apresurado y enérgico en todo momento.

Para provocar estas emociones de rapidez y exploración, el juego muestra en todo momento el mejor tiempo para completar cada nivel, así como el tiempo actual del jugador. De igual forma, la música es enérgica y rápida, lo que permite que los jugadores sientan que deben avanzar en todo momento.

Se busca que el videojuego provoque un deseo por explorar, combatir y completar el juego en el menor tiempo posible, de forma apresurada.

## _Técnico_

---

### **Pantallas**

1. Pantalla principal
    1. Opciones
    2. Estadísticas
    3. Puntuación
    4. Acceder (Iniciar sesión/Registrarse)
2. Historia del juego (imagen)
3. Juego - Nivel 1
4. Juego - Nivel 2
7. Juego - Nivel 3
8. Pantalla de puntuación
9. Fin del juego
10. (Regresa a la pantalla principal)

### **Controles**

[How will the player interact with the game? Will they be able to choose the controls? What kind of in-game events are they going to be able to trigger, and how? (e.g. pressing buttons, opening doors, etc.)]:#

**Movimiento básico**

Los jugadores son capaces de moverse de izquierda, derecha, arriba (saltar) y agacharse. Para esto, se utilizan las teclas W, A, S, D del teclado. Asimismo, conforme el jugador va avanzando de nivel, va desbloqueando algunas habilidades específicas como el doble salto, que se activará presionando dos veces “W”, y el dash, que se activará presionando la tecla “shift”, provocando que el jugador avance rápidamente en la dirección actual en el eje “x” (izquierda o derecha). Debido al tiempo limitado de desarrollo, no se espera que los jugadores sean capaces de modificar ninguna de las teclas definidas para los controles del videojuego. 

**Ataques y curación**

Los jugadores serán capaces de elegir entre dos armas principales: Cuerpo a cuerpo y a distancia. Para utilizar estas, el jugador necesitara presionar ya sea la flecha deecha o izquierda dependiendo la dirección hacia donde quiera realizar el ataque. Adicionalmente, el jugador puede seleccionar una poción de curación que solo puede ser utilizada una única vez por nivel y que se regenera al completarlo. Para cambiar de armas/curación, se utilizan los siguientes números del teclado:
- Número 1: Seleccionar arma cuerpo a cuerpo
- Número 2: Seleccionar arma a distancia
- Número 3: Usar poción de curación

**Eventos dentro del juego**

Los botones que deberán ser presionados para abrir la sala del jefe de cada piso se activarán si el jugador se acerca lo suficiente a estos, por lo que no tienen una tecla asignada de activación.

### **Mecánicas**

[Are there any interesting mechanics? If so, how are you going to accomplish them? Physics, algorithms, etc.]:#

**Colisiones con objetos sólidos:**

Para las físicas de movimiento, deberemos establecer diferentes atributos para nuestros elementos. Los obstáculos (cajas y tuberías), paredes, techo y suelo de los niveles deben contener una cierta etiqueta que nos permitan identificarlos como objetos sólidos. De esta forma, cuando un personaje, sea el jugador o un enemigo, colisione con un objeto sólido, este no podrá atravesarlo, sino que se detendrá al tocarlo, y tendrá que decidir como esquivar el objeto, ya sea saltando o agachandose.

**Colisiones con enemigos:**

Los jugadores y enemigos deben tener un contenedor definido para delimitar hasta donde llegan. Así, el jugador debe tener un atributo para saber si tiene un arma equipada y está atacando (presionando la flecha derecha/izquierda). Si esto es así y su contenedor coincide con el de los enemigos, se restará la salud de los enemigos y la cantidad de daño del jugador. De la misma forma, si un jugador no está atacando y su contenedor coincide con el de los enemigos, se restará su salud y la cantidad de daño de los enemigos. Esto mismo aplica para el arma a distancia; cuando un jugador dispare, se creará un rectángulo que si impacta con los enemigos se resta su salud.

**Mecánica de tiempo:**

Esta mecánica consiste en un contador de tiempo que incrementa con el tiempo de juego en cada partida de los jugadores. Para implementar esta mecánica y hacer nuestro juego más interesante, pondremos un cronómetro en la esquina superior izquierda de la pantalla. Al hacer esto, crearemos una atmósfera de presión, lo cual hará que el jugador busque siempre terminar el juego en un menor tiempo posible y romper su récord actual.

**Subir/bajar escaleras:**

Para pasar a algunas salas, el jugador necesitará subir o bajar una escalera. Cada escalera contendrá un atributo que define si se puede subir, bajar o ambos. Las diferentes escaleras tendrán indicadores que le hagan saber al jugador hacia qué dirección puede trasladarse. Cuando el contenedor de un jugador colisione con el de una escalera, éste podrá desplazarse sin gravedad de acuerdo a los atributos de la escalera.

**Mecánica de armas a cuerpo y a distancia**

Con el fin de crear un videojuego con mecánicas de combate diversas, se decidió implementar dos distintas armas desbloqueables en el juego.

En un inicio, el jugador solo posee el brazo de su robot como arma cuerpo a cuerpo para hacer daño a los enemigos. Tras completar cada uno de los 3 niveles, desbloquea un arma particular. A continuación se especifica cada una de ellas:

- Si el jugador no ha completado ningún nivel: Su arma principal es su brazo robótico. Este aumenta el daño del jugador en un 0% cuando la utiliza y se puede usar cada 0.5 segundos.

- Si el jugador completó el primer nivel: Su arma principal es la llave de acero. Esta aumenta el daño del jugador en un 20% cuando la utiliza y se puede usar cada 0.5 segundos.

- Si el jugador completó el segundo nivel: Su arma secundaria es la pistola láser lenta. Esta aumenta el daño del jugador en un 30% cuando la utiliza y se puede usar cada 2 segundos.

- Si el jugador completó el tercer nivel: Su arma secundaria es la pistola láser rápida. Esta aumenta el daño del jugador en un 40% cuando la utiliza y se puede usar cada 1 segundo.

Para lograr agregar cada una de estas armas al juego, consideramos los siguientes aspectos:
- Para el arma inicial (brazo del robot), el robot tiene animaciones básicas (moverse, saltar, agacharse, atacar).
- Para la llave de acero, el robot cuenta con animaciones adicionales para mostrar el arma (moverse, saltar, agacharse, atacar).
- Para la pistola láser lenta y rápida, las animaciones del arma principal (llave de acero) se mantienen, lanzando proyectiles (rectángulos pequeños de color rojo) al atacar con la pistola láser.

Cada una de estas armas se desbloquea de forma permanente para todas las partidas del jugador.

**Mecánica de experiencia**

Con el fin de crear una mecánica de juego que fomenta las recompensas aleatorias conforme al avance del jugador, este tendrá un nivel de experiencia que irá aumentando desde el nivel 0 hasta el 10. Para incrementar el nivel de experiencia del jugador, este deberá derrotar enemigos, lo que le otorgará una pequeña fracción de la experiencia total a conseguir para subir de nivel, dependiendo de la categoría de enemigos.

En el nivel de experiencia 0, el jugador debe conseguir 100 puntos de experiencia. Cada vez que el jugador aumenta de nivel de experiencia, los puntos requeridos para seguir avanzando aumentan en 15. Ejemplo:
- Nivel 0: El jugador necesita 100 puntos para subir de nivel.
- Nivel 1: El jugador necesita 115 puntos para subir de nivel.
- Nivel 2: El jugador necesita 130 puntos para subir de nivel.
- Así sucesivamente hasta llegar al nivel 10, el cual necesitará 245 puntos.

Cada enemigo otorga un porcentaje diferente de experiencia al jugador:
- Robot Normal: +10% de experiencia
- Robot Pesado: + 20% de experiencia
- Robot Aéreo: +15% de experiencia
- Jefe Final: +100% de experiencia (1 nivel completo)

Al subir de nivel, el jugador podrá elegir una de tres opciones aleatorias para mejorar su personaje. La lista completa de habilidades a desbloquear por el jugador es la siguiente:
- +10% de ataque
- +10% de salud
- +10% de defensa
- Doble salto (Solo se puede desbloquear una vez)
- Esquivar (dash) (Solo se puede desbloquear una vez)

Para otorgar estas habilidades al jugador, se deberá contar con una lista que se actualizará conforme el jugador suba de nivel, eliminando aquellas habilidades que el jugador haya obtenido y solo se puedan adquirir una vez por partida, como el doble salto o la habilidad de esquivar.

Por otro lado, las habilidades desbloqueables que mejoran las estadísticas base del jugador (ataque, salud, defensa) podrán ser obtenidas de forma acumulativa, siempre y cuando el jugador siga subiendo de nivel. Estas estadísticas se reiniciarán cuando el jugador pierda/gane el juego.

**Mecánica de movimiento**

El jugador es capaz de moverse en cuatro direcciones: arriba (saltar), moverse a la derecha, a la izquierda y agacharse. A continuación se especifican las características de cada movimiento:
- Saltar: El jugador es capaz de moverse hacia arriba al presionar la tecla “w”, ejecutando una animación de salto.
- Moverse a la derecha o izquierda: El jugador puede moverse en ambas direcciones de los niveles al presionar la tecla “a” (izquierda) o “d” (derecha), ejecutando una misma animación en dirección en la que se mueve.
- Agacharse: El jugador es capaz de agacharse al presionar la tecla “s”, reduciendo su área para lograr atravesar obstáculos o situaciones en donde se tiene menos espacio. Existe una animación que es ejecutada al momento en el que el jugador se agacha.

**Habilidades de movimiento desbloqueables:**

- Doble salto: El jugador es capaz de utilizar la habilidad de doble salto una vez la desbloquee al presionar la tecla “w” dos veces, lo cual le permitirá saltar el doble de distancia, ejecutando de nuevo la misma animación del salto normal.
- Esquivar: El jugador es capaz de desplazarse rápidamente en muy poco tiempo al presionar la tecla shift, lo cual puede usar para esquivar ataques de enemigos o acortar su tiempo de la partida.

## _Diseño de niveles_

---

### **Temas**

- En el primer nivel, ¡la competencia de robótica ha comenzado!, y la escuela se ha transformado en un campo de batalla donde los mejores competirán. Se quiere evocar el sentimiento de que el jugador esta situado en una competencia escolar de robótica y para esto se utilizaran recursos como:
1. Escuela
    1. Ambiente
        1. Competencia, tenso, activo
    2. Objetos
        1. _Ambiente_
            1. Letreros para guiar al jugador
            2. Pizarras 
            3. Cajas de madera
            4. 
        2. _Interactivos_
            1. Botón azúl
            2. Puertas
            3. Escaleras
            4. Robot Normal (enemigo)
            5. Robot Pesado (enemigo)
            6. Robot Aéreo (enemigo)
            7. Jefe Final (enemigo)

- En el segundo nivel, pasamos al lugar en donde nacen las máquinas, un laboratorio de vanguardia lleno de tecnología secreta de última generación. Se quiere evocar el sentimiento de que el jugador, al pasar del primer nivel, esta situado en el laboratorio donde se crean todos los robots, y para esto se utilizaran recursos como:
2. Laboratorio
    1. Ambiente
        1. Competencia, tenso, activo
    2. Objetos
        1. _Ambiente_
            1. Letreros para guiar al jugador
            2. Pantallas de computadora
            3. Tuberías
            4. Cajas de metal
        2. _Interactivos_
            1. Botón azúl
            2. Puertas
            3. Escaleras
            4. Robot Normal (enemigo)
            5. Robot Pesado (enemigo)
            6. Robot Aéreo (enemigo)
            7. Jefe Final (enemigo)

- En el tercer nivel, la competencia llega a su fase final en una fábrica abandonada, un lugar que alguna vez fue el corazón de la producción de robots, pero que ahora es solo un campo de batalla abandonado. Se quiere evocar el sentimiento de que el jugador esta situado en fábrica abandonada para su batalla final, y para esto se utilizaran recursos como:
3. Fábrica
    1. Ambiente
        1. Competencia, tenso, activo
    2. Objetos
        1. _Ambiente_
            1. Letreros para guiar al jugador
            2. Máquinas viejas 
            3. Tuberías oxidadas
            4. Tubos de ensayo
        2. _Interactivos_
            1. Botón azúl
            2. Puertas
            3. Escaleras
            4. Robot Normal (enemigo)
            5. Robot Pesado (enemigo)
            6. Robot Aéreo (enemigo)
            7. Jefe Final (enemigo)

- Aunque muchos de los elementos son parecidos, se busca cambiar la estética de los niveles a partir de los colores, cambio de texturas, iluminación, y diferentes elementos del entorno en el que se encuentra situado el nivel. 

### **Estructura de niveles**

En Overclocked, todos los niveles siguen una estructura base definida, pero cada partida se siente única gracias a la aleatoriedad en su diseño. Cada nivel consta de seis salas principales organizadas de forma lineal, con la primera sala funcionando como el punto de inicio y la última como la sala del jefe final. Sin embargo, dentro de este esquema estructurado, se generan variaciones que afectan tanto la exploración como la dificultad del juego.

A lo largo del nivel, es posible que algunas salas generen ramificaciones, con un máximo de dos por sala. La probabilidad de que una sala tenga una ramificación es del 30%, y si ya cuenta con una, existe un 50% de probabilidad de que aparezca una segunda. No obstante, ni la sala inicial ni la del jefe final pueden generar estas bifurcaciones, asegurando que la progresión principal se mantenga clara y ordenada. 

Dentro de estas ramificaciones, habrá una sala especial que contiene un botón azul. Este botón es clave para el avance, ya que interactuar con él desbloquea el acceso a la sala del jefe final. Si no se activa, el jugador no podrá ingresar a la sala final, lo que obliga a explorar el nivel en busca de esta sala oculta.

Además de las diferentes disposiciónes de las salas, cada partida se diferencia de las demás por la variabilidad en la aparición de obstáculos y enemigos. No solo cambia la cantidad de enemigos, sino también su tipo, lo que puede hacer que algunas partidas sean relativamente fáciles, mientras que otras resulten más desafiantes. Asimismo, la distribución y el número de obstáculos dentro de las salas varía, afectando la manera en que los jugadores deben moverse y adaptarse al entorno.

Gracias a estos elementos, ninguna partida en Overclocked es igual a la anterior. Aunque la estructura base de los niveles sea la misma, la aleatoriedad en la generación de ramificaciones, enemigos y obstáculos garantiza que cada partida ofrezca una experiencia diferente. Este sistema de variación mantiene el juego dinámico y evita la sensación de repetitividad, motivando a los jugadores a seguir superando nuevos retos en cada partida.

A continuación se muestra un ejemplo de diferentes generaciones de nivel en el juego:

**Ejemplo 1:**
![Ejemplo 1](img/ej_estructura_nivel_1.png)

En este ejemplo, el jugadr inicia en la sala verde (0) y avanza por las salas del nivel, explorando las diferentes ramificaciones, enfrentándose a enemigos, subiendo de nivel y desbloqueando habilidades. Eventualmente, el jugador encuentra la sala azul (B3) que contiene el botón azul que desbloquea la sala roja que contiene el jefe final (5).

**Ejemplo 2:**
![Ejemplo 2](img/ej_estructura_nivel_2.png)

En este segundo ejemplo, el jugador repite el proceso del nivel anterior, notando que la estructura de las ramificaciones de las salas es diferente, así como los enemigos y obstáculos que se encuentran dentro de cada una de ellas.

De esta manera, el juego busca que cada partida sea única y ofrezca un reto constante a los jugadores, quienes deberán adaptarse a las diferentes situaciones que se les presenten en cada nivel.

### **Retos**

A lo largo de los niveles, los jugadores se enfrentarán a diversos retos que pondrán a prueba su habilidad y estrategia. Estos retos incluyen:

**Enemigos**

El jugador puede encontrarse con diferentes tipos de enemigos (Robot Normal, Pesado, Volador), cada uno con las diferentes características descritas anteriormente. Algunos enemigos pueden moverse lento, pero hacer más daño (Robot Pesado), mientras que otros pueden ser veloces pero débiles (Robot Normal, Aéreo). Debido a que la cantidad y ubicación de los enemigos varia en cada partida, esto asegura que el combate nunca pueda ser completamente predecible.

**Obstáculos**

Además de los enemigos, las salas pueden contener diferentes tipos de obstaculos que afectan la movilidad del jugador y lo retan a usar diferentes habilidades. Estos pueden ser cajas, picos de metal o tuberías, que obligaran al jugador a saltar o agacharse mientras esta atacando a los enemigos. Esto también provoca que el campo de visión de los enemigos y el espacio en donde se encuentran sea diferente en cada sala.

**Jefes finales**

Al final de cada nivel, el jugador deberá enfrentarse al jefe final para poder pasar al siguiente nivel y desbloquear nuevas armas. Este jefe es un enemigo que cuenta con velocidad, salud y daño aumentados, contando con varias fases de combate y habilidades.

El enfrentamiento con el jefe es el mayor reto del nivel, requiriendo que el jugador haya explorado las diferentes salas para haber mejorado sus habilidades. Además, si el jugador no ha activado el botón azul que se encuentra en una de las salas ramificadas, el acceso a la sala del jefe permanecerá bloqueado. Esto agrega un reto adiccional, debido a que no basta con llegar al final del nivel, sino también haber explorado la mayoría de las salas para encontrar el botón.

El jefe es capaz de avanzar en la dirección del jugador (estado normal) o saltar repetidamente en dirección del mismo (estado furioso). El jugador deberá esquivar los ataques del jefe y derrotarlo para avanzar al siguiente nivel.

### **Game Flow**

El juego se desarrolla en 3 niveles distintos, cada uno con un jefe final que el jugador debe derrotar para avanzar al siguiente nivel. A continuación se describe el flujo de juego de Overclocked, comenzando desde el nivel 1:

1. El jugador inicia en una sala vacía de una escuela (nivel 1).
2. Pared a la izquierda, el jugador debe avanzar a la derecha y saltar una caja.
3. La pared muestra un letrero que muestra las direcciones en las que puede avanzar el jugador.
4. El jugador avanza a la derecha y salta la caja de madera el suelo.
5. El jugador entra en la segunda sala por el extremo izquierdo.
6. El jugador encuentra un enemigo estático en el extremo derecho.
7. El jugador observa en la pared un letrero que le indica cómo seleccionar su arma cuerpo a cuerpo y cómo utilizarla.
8. El jugador derrota al enemigo y avanza a la siguiente sala.
9. El jugador continúa avanzando por salas a la vez que derrota enemigos.
10. El jugador sube un nivel de experiencia. Se le presenta una pantalla con 3 distintas opciones de estadísticas/habilidades a desbloquear. El jugador selecciona una.
11. El jugador continúa su camino y encuentra unas escaleras en el centro de una sala. Puede seguir adelante o acercarse a las escaleras.
12. Las escaleras tienen un letrero para subir/bajar o ambos.
13. El jugador puede subir/bajar o ambos por las escaleras.
14. El jugador encuentra una sala con un botón azul.
15. El jugador se acerca al botón azul y este se activa automáticamente, mostrando un letrero que dice que la sala del jefe se ha activado.
16. El jugador busca la sala del jefe final del nivel (si no la ha encontrado), entra y lo derrota.
17. Tras derrotar al jefe, el jugador sube de nivel de experiencia automáticamente y el jugador es capaz de desbloquear una nueva habilidad aleatoria.
18. Tras derrotar a cada jefe de cada uno de los 3 niveles, el jugador obtiene un arma permanente.
    1. Espada.
    2. Pistola láser que dispara lento.
    3. Pistola láser que dispara rápido.
19. El jugador obtiene una poción de curación de un solo uso para el siguiente nivel.
20. El jugador avanza al siguiente nivel y repite el proceso.
21. Si el jugador termina el juego, se muestran las estadísticas del jugador:
    - Tiempo de partida
    - Número de muertes
    - Enemigos derrotados
    - Número total de daño infligido y recibido
    - Número de partidas completadas.
22. Se muestra la tabla de las mejores 5 puntuaciones de tiempo.
22. El jugador es devuelto al menú principal.

Cada vez que el jugador avanza de nivel, el juego se vuelve más dificil, pues los enemigos tienen un incremento en su salud y daño en un 10%. De la misma forma, conforme el jugador sube de nivel, necesita derrotar más enemigos para seguir subiendo, lo que dificulta que este se vuelva más fuerte que los enemigos y los jefes finales, generando un reto constante para el jugador.

En este ciclo de juego se busca que el jugador se sienta motivado a completar el juego en el menor tiempo posible; sin embargo, este debe aprender a dominar las mecánicas del juego y utilizar las habilidades desbloqueables de forma estratégica para lograrlo.

Los niveles tienen una duración estimada de 5 minutos cada uno, por lo que el jugador deberá completar el juego en un tiempo no mayor a 15 minutos para lograr un récord. De igual forma, el jugador puede repetir el juego las veces que desee para mejorar su tiempo y habilidades.

## _Desarrollo_

---

### **Clases abstractas / Componentes**

Para el desarrollo del videojuego Overclockes, se deben considerar las siguientes clases abstractas y componentes que se utilizarán para la creación de los elementos del juego:

1. BasePhysics: Física del juego, colisiones, movimiento, gravedad.
    1. BasePlayer: Control de jugador, experiencia, armas, habilidades.
    2. BaseEnemy: Define enemigos, movimiento.
  3. BaseObject: Define elementos que interactúan de alguna forma con el jugador, como orbes de experiencia tras derrotar a los enemigos.
2. BaseObstacle: Define elementos que pueden bloquear/dañar al jugador, como cajas, tuberías y picos en las salas de los niveles.
3. BaseInteractable: Objetos con los que el jugador puede interactuar, como el botón que desbloquea la sala del jefe y las escaleras para subir/bajar/ambos.
4. BaseSound: Control de los sonidos/música del juego.
5. BaseGameState: Control de los estados del juego, como menú principal y pausa.
6. BaseLevel: Control de los niveles, generación de mapas aleatorios, ubicación de enemigos y objetos.
7. BaseUI: Control de la interfaz de usuario, como el cronómetro, barra de salud, barra de experiencia, habilidades desbloqueables, etc.
8. BaseGame: Control principal del juego, carga de niveles, control de la música, sonidos, etc.

**Nota:** Cada una de estas clases abstractas debe ser implementada en el videojuego en clases de JavaScript, las cuales se encargarán de controlar los elementos del juego y su interacción con el jugador.

### **Clases derivadas / Composiciones de componentes**

Se deben considerar las siguientes clases derivadas y composiciones de componentes que se utilizarán para la creación de los elementos del juego:

1. BasePlayer
    1. PlayerMain: Robot controlado por el jugador.
2. BaseEnemy
    1. EnemyNormal: Robot con combate cuerpo a cuerpo (salud y daño normal). Persigue al jugador.
    2. EnemyHeavy: Robot con combate cuerpo a cuerpo (salud y daño elevado). Persigue al jugador.
    3. EnemyAerial: Robot con combate cuerpo a cuerpo (salud y daño reducido). Ignora al jugador, vuela de izquierda a derecha en las salas de los niveles.
    4. EnemyBoss: Jefe final de cada nivel (salud y daño aumentado).
3. BaseObstacle
    1. ObstacleBox: Caja de madera/metal que bloquea el paso del jugador/enemigos.
    2. ObstaclePipe: Tubería de metal bloquea el paso del jugador/enemigos.
    3. ObstacleSpike: Pico (triángulo) de metal en el suelo que daña al jugador cuando lo toca.
  4. ObstacleGate: Bloquea la sala del jefe final si el botón para desbloquearla no ha sido presionado.
4. BaseObject
    1. ObjectOrb: Orbes de experiencia que arrojan los enemigos al ser derrotados. Avanzan en la dirección del jugador hasta colisionar con él, aumentando su nivel de experiencia.
5. BaseInteractable
    1. InteractableButton: Botón ubicado en una sala aleatoria por nivel. Desbloquea la puerta “ObstacleGate” para que el jugador pueda acceder a la sala del jefe final de cada nivel.
6. BaseSound: Control de los sonidos/música del juego.
SoundEffect: Efectos de sonido para el juego.
SoundTrack: Música del juego.

**Nota:** Cada una de estas clases derivadas debe ser implementada en el videojuego en clases de JavaScript, las cuales se encargarán de controlar los elementos del juego y su interacción con el jugador.

## _Gráficos_

---

### **Atributos de estilo**

**Paleta de colores:**

Para el videojuego Overclocked, se utiliza la siguiente paleta de colores base:
- Rojo: #FF1053
- Morado: #6C6EA0
- Azul claro: #66C7F4
- Gris: #C1CAD6
- Blanco: #FFFFFF

Adicionalmente, los enemigos cuentan con los siguientes colores específicos:

- Robot Normal:
    - Naranja claro: FC683B
    - Naranja medio: #DD442C
    - Naranja oscuro: #7E3125
    - Gris claro: #DCELE7
    - Gris medio: #959AB1
- Robot Pesado:
    - Azul claro: #2CC5F6
    - Azul oscuro: #1490C3
    - Naranja oscuro: #7E3125
    - Gris claro: #DCELE7
    - Gris medio: #959AB1
- Robot Aéreo:
    - Café claro: #F4AC66
    - Café medio: #CB815E
    - Café oscuro: #6F3E43
    - Gris claro: #DCELE7
    - Gris medio: #959AB1
- Contorno de los enemigos
- Gris oscuro: #434A5F

De esta forma, Overclocked utiliza tonos claros entre blanco, gris, azul, rojo, naranja y café. Se busca que estos tonos creen una atmósfera minimalista, buscando utilizar tan solo 3 tonos entre colores. Ejemplo de esto es el gris, que solo tiene una variante clara, media y oscura. Igualmente, entre niveles pueden cambiar algunos colores para que los enemigos combinen con la estética del nivel.

El estilo gráfico del juego es de 32 bits, por lo que se busca que el diseño de los personajes sea minimalista tipo retro. Para esto, los personajes deben contar con bordes negros/gris oscuro que resalten su silueta del ambiente resto de elementos en la pantalla.

**Reglas de diseño de Overclocked:**

Para establecer un estilo determinado y homogéneo a lo largo del videojuego, establecieron las siguientes reglas de diseño:

1. Personajes y assets de 32 bits.
2. Paleta de colores pastel: blanco, gris, azul, rojo, naranja y café.
3. Personajes llamativos y animados: Cada personaje debe tener una animación atractiva de al menos 2 fotogramas al moverse e interactuar con el jugador.
4. Silueta oscura: Tanto los personajes como los recursos (assets) del videojuego deben contar con una silueta oscura, separándolos del fondo, escenarios y demás  elementos del videojuego.
5. El diseño de los personajes debe ser minimalista estilo retro: Para lograr esto, los personajes deben contar con ojos grandes y no más de 7 tonalidades de la paleta de color.
6. Al tener en cuenta que los robots son la temática del juego, estos deben tener características que enfaticen su función. Ejemplo: El robot del jugador puede moverse y atacar en todas direcciones, por lo que su diseño cuenta con un brazo expandible y una rueda que lo ayuda a trasladarse por los escenarios.
7. Los personajes pueden tener bordes afilados que resalten su silueta, así como otros que sean curvados.

**Retroalimentación:**

El jugador puede recibir retroalimentación de qué realizar en diferentes situaciones del videojuego:
- Activar botones: Los botones cuentan con una silueta luminosa que hace que destaquen del resto de elementos en la sala.
- Mini-mapa: El jugador cuenta con un mini-mapa disponible en la esquina superior derecha en todo momento para conocer su ubicación en el nivel.
- Cronómetro: El jugador cuenta con un cronómetro disponible en la esquina superior izquierda en todo momento. Con este elemento, el jugador podrá conocer el tiempo que ha invertido en todo momento en el videojuego.
- Letreros: En las primeras 2 salas de juego del primer nivel, el jugador puede consultar letreros ubicados en el fondo de la sala con la siguiente información:
    - Sala 1: Letrero que indica al jugador las teclas para moverse (W,A,S,D).
    - Sala 2: Letrero que indica al jugador las teclas para atacar (Flechas izquierda y derecha).
- Indicadores: Cuando un jugador se encuentra frente a una escalera, esta cuenta con un letrero que indica una flecha en la dirección en la que el jugador puede subir/bajar/ambos.


### **Gráficos necesarios**

1. Personajes
    1. Robots
        1. Principal (Skippy) (idle, caminar, saltar, agacharse, atacar, recibir daño)
        2. Robot Normal (idle, caminar, atacar, recibir daño)
        3. Robot Pesado (idle, caminar, atacar, recibir daño)
        4. Robot Volador (idle, volar, atacar, recibir daño)
        5. Jefe (idle, caminar, atacar, recibir daño)
2. Bloques
    1. Contenedor (caja de madera, obstáculo)
    2. Contenedor (caja de metal, obstáculo)
    3. Suelo de baldosas
    4. Muro de laboratorio
    5. Muro de escuela
    6. Muro de fábrica abandonada
    7. Tubería de metal (obstáculo)
    8. Picos puntiagudos (obstáculo)
3. Ambiente
    3. Letreros
4. Otros
    1. Botón azul (desbloquea la sala del jefe final de cada nivel)
    2. Puerta de laboratorio (se abre al presionar el botón azul)

## _Sonido/Música_

---

### **Atributos de estilo**

[Again, consistency is key. Define that consistency here. What kind of instruments do you want to use in your music? Any particular tempo, key? Influences, genre? Mood?]: #

[Stylistically, what kind of sound effects are you looking for? Do you want to exaggerate actions with lengthy, cartoony sounds (e.g. mario&#39;s jump), or use just enough to let the player know something happened (e.g. mega man&#39;s landing)? Going for realism? You can use the music style as a bit of a reference too. ]: #

[Remember, auditory feedback should stand out from the music and other sound effects so the player hears it well. Volume, panning, and frequency/pitch are all important aspects to consider in both music _and_ sounds - so plan accordingly!]: #

### **Sonidos necesarios**

1. Effectos
    1. Giro de rueda (movimiento del jugador, igual para todo tipo de suelos)
    2. Salto del jugador
    3. Agacharse
    4. Aterrizaje del jugador (al caer verticalmente)
    5. Ataque cuerpo a cuerpo (al atacar enemigos u objetos)
    6. Ataque a distancia (pistola láser)
    7. Abrir puerta
2. Retroalimentación (Feedback)
    1. Abrir botella (recuperar salud)
    2. Golpe (daño hacia el jugador)
    3. Presionar botón
    4. Golpe exagerado (enemigo derrotado)
    5. Explosión pequeña (jugador derrotado)

### **Música necesaria**

1. Música lenta-melódica para el menú principal.
2. Música tenue-lenta para menú de settings(Aplicable a todas las páginas de settings independientemente del nivel) 
3. Música rápida-enérgica con efectos de sonido que evoquen a escritura o a un salón de clases(nivel 1).
4. Música rápida-enérgica, con efectos de sonido de química, sonidos genéricos de ciencia (nivel dos).
5. Música lúgubre, efectos de sonido mecánicos, eco, alta reverberación (nivel 3).
6.Música épica, con sonidos cyberpunk-mecánicos (Final boss).
7. Música feliz-nostálgica(créditos finales).
*Las canciones del nivel 1 y 2, al llegar al boss del nivel acelerarán su velocidad.

## _Ilustraciones_

---

### **Personaje principal**

Primeros bocetos de Skippy
![Bocetos](img/skippy_concept.png)

Idle

![Idle](img/skippy_idle.gif)

Caminar

![Caminar](img/skippy_walk.gif)

Saltar

![Jumping sprites](img/skippy_jump.gif)

Agacharse
![Crouching sprites](img/skippy_crouch.gif)

Ataque cuerpo a cuerpo
![Attacking sprites](img/skippy_attack.gif)

Ataque a distancia
![Shooting sprites](img/skippy_shoot.gif)

### **Enemigos**

Robot Normal
![Robot Normal](img/robot_normal.gif)

Robot Pesado
![Robot Pesado](img/robot_heavy.gif)

Robot Aéreo
![Robot áereo](img/robot_fly.gif)

### **Niveles**

Introducción del juego
![Intro](img/intro_overclocked.png)
Skippy es un robot dieseñado para combatir en una competencia de robótica. Después de ser activado, descubre que debe completar una serie de niveles en el menor tiempo posible para ser reconocido como ganador de la competencia. Sin tiempo que perder, Skippy se adentra en el primer nivel de la competencia.

**Estructura de niveles:**

![Estructura Niveles](img/level_structure.png)

Los niveles cuentan con una estructura lineal con 1 o 2 bifurcaciones en salas intermedias. Cada sala contiene enemigos y obstáculos aleatorios, así como un botón para abrir la sala del jefe final.

### **Items**

![Items](img/melee_1.png)
**Arma cuerpo a cuerpo:** Brazo robótico de Skippy. Este es el arma inicial del jugador y se utiliza para atacar a los enemigos en combate cuerpo a cuerpo. Se desbloquea al iniciar el juego y aumenta el daño del jugador en un 0%.

![Items](img/melee_2.png)
**Arma cuerpo a cueropo:** Llave de acero. Esta arma se desbloquea al completar el primer nivel y aumenta el daño del jugador en un 20%.

![Items](img/gun_1.png)
**Arma a distancia:** Pistola láser lenta. Esta arma se desbloquea al completar el segundo nivel y aumenta el daño del jugador en un 30%.

![Items](img/gun_2.png)
**Arma a distancia:** Pistola láser rápida. Esta arma se desbloquea al completar el tercer nivel y aumenta el daño del jugador en un 40%.

![Items](img/healing.png)
**Poción de curación:** Recupera 50% de la salud del jugador. Se recarga al completar un nivel y solo se puede utilizar una vez por cada uno.

![Items](img/xp_orb.png)
**Orbe de experiencia:** Aumenta el nivel de experiencia del jugador al ser recogido. Se obtiene al derrotar a los enemigos.

### **Elementos GUI**

**Recorrido del jugador:**

El juego muestra los principales controles de movimiento del jugador, así como un mini-mapa para guiarlo y un cronómetro para medir su tiempo de partida.
![GUI 1](img/gui_1.png)

El jugador debe enfrentarse al primer enemigo, seleccionando su arma cuerpo a cuerpo y aprendiendo a atacar.
El jugador puede ver su barra de salud, barra de experiencia y objeto de curación en todo momento.
![GUI 2](img/gui_2.png)

El jugador puede subir de nivel de experiencia tras derrotar cada enemigo.
![GUI 3](img/gui_3.png)

El jugador puede seleccionar una habilidad aleatoria tras subir de nivel.
![GUI 4](img/gui_4.png)

### **Pantallas**

**Menú Principal:**

El menú principal muestra las opciones de juego, configuración y estadísticas.
![Main Menu](img/main_menu.jpg)

**Menú de Configuración/Opciones:**

El menú de configuración muestra las opciones para ajustar el audio global de sonido y música.
![Settings Menu](img/settings_menu.jpg)

**Menú de pausa:**

El menú de pausa muestra las opciones para continuar o salir del juego.
![Pause Menu](img/pause_menu.jpg)

**Menú de estadísticas:**

El menú de estadísticas contiene 2 secciones: Estadísticas del jugador y mejores puntuaciones.
![Stats Menu](img/stats_menu_2.jpg)
![Stats Menu](img/stats_menu_1.jpg)

## _Lista de assets_

---

### **Gráficos**

**Enemigos, obstáculos y objetos:**

- [Pixel platformer](https://www.kenney.nl/assets/pixel-platformer)

- [Pixel platformer Industrial Expansion](https://www.kenney.nl/assets/pixel-platformer-industrial-expansion)

- [Tech dungeon: Roguelite](https://trevor-pupkin.itch.io/tech-dungeon-roguelite)

- [Laboratory pixel art tileset](https://marceles.itch.io/land-of-pixels-laboratory-tileset-pixel-art)

- [Free Industrial Zone Tileset Pixel Art](https://craftpix.net/freebies/free-industrial-zone-tileset-pixel-art/?srsltid=AfmBOoodWJ1DTFH6MvbTnxbfGMwfpV5uxx7G4rHbyunapg08hc53c9XH)

**UI:**

- [UI Pack - Pixel Adventure](https://www.kenney.nl/assets/ui-pack-pixel-adventure)

- [UI Pack - Sci-Fi](https://www.kenney.nl/assets/ui-pack-sci-fi)

- [UI Pack](https://www.kenney.nl/assets/ui-pack)

- [Input Prompts Pixel 16x](https://www.kenney.nl/assets/input-prompts-pixel-16)

- [Cursor Pixel Pack](https://www.kenney.nl/assets/cursor-pixel-pack)

### **Audio**

**Efectos de sonido:**

- [Interface Sounds](https://www.kenney.nl/assets/interface-sounds)

- [Sci-fi Sounds](https://www.kenney.nl/assets/sci-fi-sounds)

- [Impact Sounds](https://www.kenney.nl/assets/impact-sounds)

- [Music Jingles](https://www.kenney.nl/assets/music-jingles)

**Música:**

- [Music Assets](https://tallbeard.itch.io/music-loop-bundle)

- [Pink Bloom Synthwave Music Pack](https://davidkbd.itch.io/pink-bloom-synthwave-music-pack)

## _Cronograma_

---

El objetivo del desarrollo del videojuego es completar todos los elementos en los primeros 5 sprints, con un tiempo estimado de 1 mes y medio, con sprints de 1 semana cada uno. Para los 2 sprints finales (sprint 6 y 7), se dedicarán a la correción de errores, así como issues que hayan tenido que ser retomados de sprints anteriores.

A continuación se muestra el cronograma de desarrollo del videojuego:

Sprint 1:

1. Desarrollar clases base
    1. Entidades base
        1. Jugador base
        2. Enemigo base (uso de polimorfismo para los diferentes métodos de ataque)
        3. Bloque base
  2. Estado base de app
        1. Mundo del juego
        2. Mundo del menú

Sprint 2:

3. Desarrollar las clases de jugador y bloques
    1. Físicas/Colisiones (hitbox genérico para todos los bloques)
4. Desarrollar clases derivadas
    1. Bloques
        1. Estáticos
        2. Abrir (método de clase puerta  dependiente de “botón”)
        3. Botón
    2. Enemigos
        1. Robot Normal
        2. Robot Pesado
        3. Robot Aéreo
        4. Jefe Final
5. Desarrollar base de datos relacional (MySQL) del juego
    1. Hacer un diagrama Entidad-Relación UML de la base de datos
    2. Crear documentación del diagrama para justificar las relaciones entre las tablas
    3. Crear las tablas de la base de datos:
        1. Tabla de jugadores
        2. Tabla de puntuaciones
        3. Tabla de niveles
        4. Tabla de enemigos
        5. Tabla de bloques
        6. Tabla de objetos
        7. Tabla de habilidades
        8. Tabla de armas
    4. Hacer la conexión a la base de datos en el juego a través de una API

Sprint 3 y 4:

6. Diseño de niveles
    1. Introducir movimiento/salto
    2. Introducir ataque
    3. Tener en cuenta el paso del jugador, para que pueda practicar entre lecciones

Sprint 5:

7. Diseño de sonidos
8. Diseño de música

Sprint 6:

9. Finalizar página web
10. Corrección de errores

Sprint 7:

11. Corrección de errores
12. Entrega final