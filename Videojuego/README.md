# 🎮 Videojuego: Overclcoked

![Logo-Overclocked](docs/img/logo_overclocked.png)
![Skippy](docs/img/skippy_idle.gif)

## 🤖 Equipo - BotRunners:
- Diego Córdova Rodríguez, A01781166
- Lorena Estefanía Chewtat Torres, A01785378
- Eder Jezrael Cantero Moreno, A01785888

## 📖 Descripción
**Overclocked** Overclocked es un videojuego roguelite de acción en 2D donde encarnas un robot en una competencia de robótica. Explora mapas generados aleatoriamente, derrota rivales mecánicos en combate cuerpo a cuerpo o a distancia y encuentra el botón que activa la sala del jefe final.

## 🚀 Características
- 🌟 **Generación aleatoria de niveles**: Cada nivel se compone por un conjunto de salas colocadas de forma aleatoria, por lo que tu experiencia de juego nunca será la misma.
- 🤼 **Combate variado**: Puedes encontrar diferentes tipos de enemigos dentro de las salas, desde robots normales que bajan poca vida y se desplazan rápidamente, hasta pesados o voladores.
- 🕹️ **Habilidades**: Acumula experiencia para subir de nivel y desbloquear una nueva habilidad que te ayude a completar el juego con mayor facilidad. Desbloquea mejoras de tus estadísticas o habilidades como doble salto o dash.
- 🔧 **Armas**: Cada vez que completas un nivel, desbloqueas una nueva arma permanente para tu partida.
- ⚙️ **Jefes finales**: Para completar cada nivel, deberás enfrentarte a un jefe final. Si lo derrotas, subirás de nivel y podrás avanzar al siguiente nivel.

## 🛠️ Instrucciones para correr el juego

- Acceder a la página de GitHub Pages del repositorio, donde se encuentra la página de inicio del videojuego: [Overclocked - Inicio](https://diegocrdz.github.io/TC2005B_Equipo1_BotRunners/Web/HTML/inicio.html). En el menú de navegación en la parte superior, haz clic en "Jugar" para acceder a la página del juego.
- Si deseas acceder directamente a la página del juego, puedes acceder al siguiente enlace: [Overclocked - Juego](https://diegocrdz.github.io/TC2005B_Equipo1_BotRunners/Videojuego/game/html/game.html).
- Una vez se haya iniciado el juego, se mostrará el menú principal del mismo. Aquí se deberá presionar nuevamente el botón "Jugar" para inciar la partida.

## 🕹️ Instrucciones para jugar

- Cuando se inicie el juego, se mostrará un menú con varias opciones. Presiona el botón "Jugar" para comenzar la partida.
- Al iniciar la partida, se mostrará una pantalla con la historia del juego. Esta pantalla tiene una duración de 30 segundos, aunque puede ser omitida presionando la tecla "Espacio".
- Deberás avanzar hacia la derecha para avanzar en la siguiente sala. En cada sala, encontrarás diferentes tipos de enemigos y obstáculos. Deberás derrotar a los enemigos para avanzar a la siguiente sala.
- Puedes guiarte por el minimapa que se encuentra en la parte superior derecha de la pantalla. Este minimapa te mostrará tu ubicación actual en el nivel, así como la ubicación de la sala del jefe final (roja).
- Deberás buscar la sala en donde aparezca un botón azul. Al presionarlo, notarás que la sala del jefe final en el minimapa (roja) pasará a ser de color verde, indicando que ha sido desbloqueada.
- Una vez hayas desbloqueado la sala del jefe final, podrás entrar a esta para derrotarlo y avanzar al siguiente nivel.

## ⌨️ Controles

#### Movimiento
- **W / Espacio**: Saltar
- **A**: Avanzar a la izquierda
- **D**: Avanzar a la derecha
- **S**: Agacharse

#### Combate
- **Flecha izquierda / derecha**: Atacar hacia la izquierda o derecha. Esto es independiente del arma que tengas equipada.

#### Interacción
- **Flecha arriba**: Subir escaleras. Esto solo funcionará si te encuentras posicionado en una escalera y tiene una flecha de color verde hacia arriba.
- **Flecha abajo**: Bajar escaleras. Esto solo funcionará si te encuentras posicionado en una escalera y tiene una flecha de color verde hacia abajo.
- **Activar botones**: Automáticamente al acercarte a un botón, se activará.

#### Habilidades
Las habilidades se desbloquean al subir de nivel. Cada vez que subas de nivel, podrás seleccionar una nueva habilidad con el **click izquierdo** del ratón. Las habilidades son las siguientes:
- **Doble salto**: Presiona **W** o **Espacio** para realizar un segundo salto en el aire.
- **Dash**: Presiona **Shift** para desplazarte rápidamente en la dirección horizontal en la que te encuentres. Esta habilidad te volverá invencible durante 1 segundo después de utilizarla.
- **Vida máxima**: Aumenta tu vida máxima en 10 puntos.
- **Resistencia**: Aumenta tu resistencia en 10 puntos. La resistencia reduce el daño que te infligen los enemigos. Por ejemplo, si tienes 10 puntos de resistencia y un enemigo te hace 20 puntos de daño, solo recibirás 10 puntos de daño.
- **Daño**: Aumenta tu daño en 10 puntos. Esto se aplica a todos los ataques que realices, tanto cuerpo a cuerpo como a distancia.

#### Armas y Curación
- **1**: Seleccionar arma cuerpo a cuerpo
- **2**: Seleccionar arma a distancia (bloqueada en el nivel 1)
- **3**: Utilizar una batería que te regenera el 50% de tu vida máxima. Esta batería se recarga cada vez que completas un nivel, por lo que deberás utilizarla sabiamente.

#### Pausa
- **Esc / P**: Pausar el juego. Esto abrirá un menú con varias opciones, como reiniciar el juego o salir al menú principal.

#### Reiniciar partida
- **R**: Reiniciar partida. Esto reiniciará automáticamente tu partida a la sala 1 del nivel 1, perdiendo todas tus armas y habilidades desbloqueadas.

## ¿Qué funcionalidad ya está terminada y qué está aún en desarrollo?

### Funcionalidades terminadas
- Generación aleatoria de niveles
- Generación aleatoria de enemigos en salas
- Generación aleatoria de obstáculos en salas
- Animaciones de los personajes (jugador y enemigos)
- Menú de interfaz de usuario (UI) dentro del juego
- Menú de opciones (para ajustar volumen de música y sonidos)
- Menú de pausa
- Menú principal (falta la sección de estadísticas)
- Combate cuerpo a cuerpo y a distancia
- Sistema de armas cuerpo a cuerpo y a distancia
- Desbloqueo de armas permanentes
- Jefes finales
- Sistema de experiencia y niveles
- Curación
- Pausa
- Reinicio de partida
- Sonidos de los menús del juego
- Minimapa
- Pantallas de historia (inicio y final)
- Pantalla de Game Over
- Pantalla de victoria
- Pantalla de inicio
- Sonidos de los personajes (jugador y enemigos)
- Música de los niveles y menús

### Funcionalidades en desarrollo
- Menú de estadísticas. Para esto debemos hacer la conexión con la API y definir los endpoints que se utilizarán. Las estadísticas que se mostrarán son las siguientes:
    - Estadísticas personales
    - Estadísticas globales
    - Tabla de los 5 jugadores que han completado el juego en menos tiempo
- Permitir que el jugador inicie sesión o se registre para guardar su progreso. El menú ya está implementado, pero falta la conexión con la API para la base de datos.

Link para acceder al juego: [Overclocked - Juego](https://diegocrdz.github.io/TC2005B_Equipo1_BotRunners/Videojuego/game/html/game.html)