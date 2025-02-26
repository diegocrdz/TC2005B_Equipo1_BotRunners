![Logo Tec](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeCTWgs8hKfnOJ5vedq5xNXygQMUcdX_0zLA&s)

# **Overclocked**

## _Game Design Document_

---

##### **Copyright notice / author information / boring legal stuff nobody likes**

Este videojuego ha sido desarrollado  a lo largo del semestre febrero-junio de 2025 como parte de la materia TC2005B: Construcción de software y toma de decisiones en el Tecnológico de Monterrey, Campus Santa Fe.

**Profesores:**
- **Desarrollo de videojuegos:** Gilberto Echeverría Furió
- **Desarrollo Web:** Octavio Navarro Hinojosa
- **Base de datos, Análisis y modelación de sistemas de software:** Esteban Castillo Juarez

**Autores del videojuego:**
- Diego Córdova Rodríguez, A01781166
- Lorena Estefanía Chewtat Torres, A01785378
- Eder Jezrael Cantero Moreno, A01785888
##
![Overclocked logo](overclocked_logob.png)
##
## _Index_

---

1. [Index](#index)
2. [Game Design](#game-design)
    1. [Summary](#summary)
    2. [Gameplay](#gameplay)
    3. [Mindset](#mindset)
3. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)
    3. [Mechanics](#mechanics)
4. [Level Design](#level-design)
    1. [Themes](#themes)
        1. Ambience
        2. Objects
            1. Ambient
            2. Interactive
        3. Challenges
    2. [Game Flow](#game-flow)
5. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

## _Game Design_

---

### **Summary**

[Sum up your game idea in 2 sentences. A kind of elevator pitch. Keep it simple!]: #

Overclocked es un roguelite de acción en 2D donde encarnas un robot en una competencia de robótica. Explora mapas generados aleatoriamente, derrota rivales mecánicos en combate cuerpo a cuerpo o a distancia y encuentra el botón que activa la sala del jefe final.

Cada victoria te otorga puntos de experiencia para subir de nivel y desbloquear mejoras aleatorias para potenciar tus estadísticas de fuerza, resistencia, velocidad o habilidades de movimiento. Tras completar cada uno de los 3 niveles, desbloqueas armas permanentes que te permitirán reducir el tiempo en el que terminas el juego, ¿Tienes la habilidad para convertirte en el robot definitivo?

### **Gameplay**

[What should the gameplay be like? What is the goal of the game, and what kind of obstacles are in the way? What tactics should the player use to overcome them?]: #

**Estructura del gameplay**

Overclocked es un juego que incentiva a los jugadores a completar el juego en el menor tiempo posible. El jugador encarna un pequeño robot llamado “Skippy”, quien cuenta con un brazo robótico como arma inicial para enfrentarse a los demás robots de la competencia.

El jugador inicia el videojuego en una sala rectangular de fondo blanco, con un letrero en la pared que indica los controles de movimiento con las teclas “W,A,S,D”. De igual forma, hay un letrero con una flecha hacia la izquierda, guiando al jugador a avanzar en esa dirección.

Al avanzar, el jugador se encuentra con un robot enemigo de categoría Normal (salud y daño equilibrado). En la pared de esta sala, se encuentra un letrero que indica los controles de ataque cuerpo a cuerpo con la tecla “1” y “click derecho” para atacar.

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

### **Mindset**

[What kind of mindset do you want to provoke in the player? Do you want them to feel powerful, or weak? Adventurous, or nervous? Hurried, or calm? How do you intend to provoke those emotions?]: #

Overclocked -al igual que una competencia de robótica- fomenta la competitividad, donde solo los mejores son reconocidos por su esfuerzo. De esta forma, el juego busca que los jugadores tengan un deseo por explorar y navegar rápidamente los niveles, en un tiempo no mayor a 5 minutos por cada uno. El juego busca provocar un ambiente apresurado y enérgico en todo momento.

Para provocar estas emociones de rapidez y exploración, el juego muestra en todo momento el mejor tiempo para completar cada nivel, así como el tiempo actual del jugador. De igual forma, la música es enérgica y rápida, lo que permite que los jugadores sientan que deben avanzar en todo momento.

Se busca que el videojuego provoque un deseo por explorar, combatir y completar el juego en el menor tiempo posible, de forma apresurada.

## _Technical_

---

### **Screens**

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

### **Controls**

[How will the player interact with the game? Will they be able to choose the controls? What kind of in-game events are they going to be able to trigger, and how? (e.g. pressing buttons, opening doors, etc.)]:#

**Movimiento básico**
Los jugadores son capaces de moverse de izquierda, derecha, arriba (saltar) y agacharse. Para esto, se utilizan las teclas W, A, S, D del teclado. Asimismo, conforme el jugador va avanzando de nivel, va desbloqueando algunas habilidades específicas como el doble salto, que se activará presionando dos veces “W”, y el dash, que se activará presionando la tecla “shift”, provocando que el jugador avance rápidamente en la dirección actual en el eje “x” (izquierda o derecha). Debido al tiempo limitado de desarrollo, no se espera que los jugadores sean capaces de modificar ninguna de las teclas definidas para los controles del videojuego. 

**Ataques y curación**
Los jugadores serán capaces de elegir entre dos armas principales: Cuerpo a cuerpo y a distancia. Adicionalmente, el jugador puede seleccionar una poción de curación que solo puede ser utilizada una única vez por nivel y que se regenera al completarlo. Para cambiar de armas/curación, se utilizan los siguientes números del teclado:
- Número 1: Seleccionar arma cuerpo a cuerpo
- Número 2: Seleccionar arma a distancia
- Número 3: Seleccionar poción de curación

**Eventos dentro del juego**
Los botones que deberán ser presionados para abrir la sala del jefe de cada piso se activarán si el jugador se acerca lo suficiente a estos, por lo que no tienen una tecla asignada de activación.

### **Mechanics**

[Are there any interesting mechanics? If so, how are you going to accomplish them? Physics, algorithms, etc.]:#

**Colisiones con objetos sólidos:**
Para las físicas de movimiento, deberemos establecer diferentes atributos para nuestros elementos. Los obstáculos (cajas y tuberías), paredes, techo y suelo de los niveles deben contener una cierta etiqueta que nos permitan identificarlos como objetos sólidos. De esta forma, cuando un personaje, sea el jugador o un enemigo, colisione con un objeto sólido, este no podrá atravesarlo, sino que se detendrá al tocarlo, y tendrá que decidir como esquivar el objeto, ya sea saltando o agachandose.

**Colisiones con enemigos:**
Los jugadores y enemigos deben tener un contenedor definido para delimitar hasta donde llegan. Así, el jugador debe tener un atributo para saber si tiene un arma equipada y está atacando (presionando el “click izquierdo” del ratón). Si esto es así y su contenedor coincide con el de los enemigos, se restará la salud de los enemigos y la cantidad de daño del jugador. De la misma forma, si un jugador no está atacando y su contenedor coincide con el de los enemigos, se restará su salud y la cantidad de daño de los enemigos. Esto mismo aplica para el arma a distancia; cuando un jugador dispare, se creará un rectángulo que si impacta con los enemigos se resta su salud.

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

Habilidades de movimiento desbloqueables:
- Doble salto: El jugador es capaz de utilizar la habilidad de doble salto una vez la desbloquee al presionar la tecla “w” dos veces, lo cual le permitirá saltar el doble de distancia, ejecutando de nuevo la misma animación del salto normal.
- Esquivar: El jugador es capaz de desplazarse rápidamente en muy poco tiempo al presionar la tecla shift, lo cual puede usar para esquivar ataques de enemigos o acortar su tiempo de la partida.



## _Level Design_

---

_(Note : These sections can safely be skipped if they&#39;re not relevant, or you&#39;d rather go about it another way. For most games, at least one of them should be useful. But I&#39;ll understand if you don&#39;t want to use them. It&#39;ll only hurt my feelings a little bit.)_

### **Themes**

1. Forest
    1. Mood
        1. Dark, calm, foreboding
    2. Objects
        1. _Ambient_
            1. Fireflies
            2. Beams of moonlight
            3. Tall grass
        2. _Interactive_
            1. Wolves
            2. Goblins
            3. Rocks
2. Castle
    1. Mood
        1. Dangerous, tense, active
    2. Objects
        1. _Ambient_
            1. Rodents
            2. Torches
            3. Suits of armor
        2. _Interactive_
            1. Guards
            2. Giant rats
            3. Chests

_(example)_

### **Game Flow**

1. El jugador inicia en una sala vacía de laboratorio.
2. Pared a la izquierda, el jugador debe avanzar a la derecha y saltar una caja.
3. La pared muestra un letrero que muestra las direcciones en las que puede avanzar el jugador.
4. El jugador avanza a la derecha y salta la caja de madera/metal en el suelo.
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


## _Development_

---

### **Abstract Classes / Components**

1. BasePhysics
    1. BasePlayer
    2. BaseEnemy
    3. BaseObject
2. BaseObstacle
3. BaseInteractable

_(example)_

### **Derived Classes / Component Compositions**

1. BasePlayer
    1. PlayerMain
    2. PlayerUnlockable
2. BaseEnemy
    1. EnemyWolf
    2. EnemyGoblin
    3. EnemyGuard (may drop key)
    4. EnemyGiantRat
    5. EnemyPrisoner
3. BaseObject
    1. ObjectRock (pick-up-able, throwable)
    2. ObjectChest (pick-up-able, throwable, spits gold coins with key)
    3. ObjectGoldCoin (cha-ching!)
    4. ObjectKey (pick-up-able, throwable)
4. BaseObstacle
    1. ObstacleWindow (destroyed with rock)
    2. ObstacleWall
    3. ObstacleGate (watches to see if certain buttons are pressed)
5. BaseInteractable
    1. InteractableButton

_(example)_

## _Graphics_

---

### **Style Attributes**

What kinds of colors will you be using? Do you have a limited palette to work with? A post-processed HSV map/image? Consistency is key for immersion.

What kind of graphic style are you going for? Cartoony? Pixel-y? Cute? How, specifically? Solid, thick outlines with flat hues? Non-black outlines with limited tints/shades? Emphasize smooth curvatures over sharp angles? Describe a set of general rules depicting your style here.

Well-designed feedback, both good (e.g. leveling up) and bad (e.g. being hit), are great for teaching the player how to play through trial and error, instead of scripting a lengthy tutorial. What kind of visual feedback are you going to use to let the player know they&#39;re interacting with something? That they \*can\* interact with something?

### **Graphics Needed**

1. Characters
    1. Human-like
        1. Goblin (idle, walking, throwing)
        2. Guard (idle, walking, stabbing)
        3. Prisoner (walking, running)
    2. Other
        1. Wolf (idle, walking, running)
        2. Giant Rat (idle, scurrying)
2. Blocks
    1. Dirt
    2. Dirt/Grass
    3. Stone Block
    4. Stone Bricks
    5. Tiled Floor
    6. Weathered Stone Block
    7. Weathered Stone Bricks
3. Ambient
    1. Tall Grass
    2. Rodent (idle, scurrying)
    3. Torch
    4. Armored Suit
    5. Chains (matching Weathered Stone Bricks)
    6. Blood stains (matching Weathered Stone Bricks)
4. Other
    1. Chest
    2. Door (matching Stone Bricks)
    3. Gate
    4. Button (matching Weathered Stone Bricks)

_(example)_


## _Sounds/Music_

---

### **Style Attributes**

Again, consistency is key. Define that consistency here. What kind of instruments do you want to use in your music? Any particular tempo, key? Influences, genre? Mood?

Stylistically, what kind of sound effects are you looking for? Do you want to exaggerate actions with lengthy, cartoony sounds (e.g. mario&#39;s jump), or use just enough to let the player know something happened (e.g. mega man&#39;s landing)? Going for realism? You can use the music style as a bit of a reference too.

 Remember, auditory feedback should stand out from the music and other sound effects so the player hears it well. Volume, panning, and frequency/pitch are all important aspects to consider in both music _and_ sounds - so plan accordingly!

### **Sounds Needed**

1. Effects
    1. Soft Footsteps (dirt floor)
    2. Sharper Footsteps (stone floor)
    3. Soft Landing (low vertical velocity)
    4. Hard Landing (high vertical velocity)
    5. Glass Breaking
    6. Chest Opening
    7. Door Opening
2. Feedback
    1. Relieved &quot;Ahhhh!&quot; (health)
    2. Shocked &quot;Ooomph!&quot; (attacked)
    3. Happy chime (extra life)
    4. Sad chime (died)

_(example)_

### **Music Needed**

1. Slow-paced, nerve-racking &quot;forest&quot; track
2. Exciting &quot;castle&quot; track
3. Creepy, slow &quot;dungeon&quot; track
4. Happy ending credits track
5. Rick Astley&#39;s hit #1 single &quot;Never Gonna Give You Up&quot;

_(example)_


## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_

1. develop base classes
    1. base entity
        1. base player
        2. base enemy
        3. base block
  2. base app state
        1. game world
        2. menu world
2. develop player and basic block classes
    1. physics / collisions
3. find some smooth controls/physics
4. develop other derived classes
    1. blocks
        1. moving
        2. falling
        3. breaking
        4. cloud
    2. enemies
        1. soldier
        2. rat
        3. etc.
5. design levels
    1. introduce motion/jumping
    2. introduce throwing
    3. mind the pacing, let the player play between lessons
6. design sounds
7. design music

_(example)_
