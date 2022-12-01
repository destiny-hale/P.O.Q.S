   // Input handling and basic player movement
import kaboom from "kaboom"
// Start kaboom
const k = kaboom()
// Load assets
const passets = [
  "smile", "evilsmile", "sadsmile", "angry", "sky3", "conebullet0", "conebullet45", "conebullet-45", "cardinalbullet", "smilebeta", "bean", "trollface", "kid1", "bubble", "powerbox", "shieldbox", "randombox", "book", "gameover", "robertboss", "healorb"
]
for (const asset of passets) {
	loadSprite(asset, `/sprites/${asset}.png`)
}
const jassets = [
  "manface",
]
for (const jasset of jassets) {
	loadSprite(jasset, `/sprites/${jasset}.jpg`)
}
const sounds = [
  "milkyways", "kingdomrush", "clash", "galaxyboss", "death", "jackitup", "shieldrecharge", "hurt1", "hurt2", "hurt3", "heal", "win"
]
for(const soundes of sounds){
  loadSound(soundes, `/sounds/${soundes}.mp3`)
}
loadSound("bulletchange", "/sounds/bulletchange.wav")
loadSound("edeath", "/sounds/edeath.ogg")
const objs = [
	"big",
  "cone",
  "cardinal",
  "normal",
]

let killhighscore = 0
let gamecount = 1
let fastesttime
let attempt = 1



scene("menu", () =>{
  let spr = "None selected"
  let music = play("kingdomrush", {
    loop: true
  })
    let background = add([
    sprite("sky3", {width: width(), height: height()})
  ])
  //text
  	add([
		text("welcome to Practical Opulent Queryplan Shooter", { size: 50 }),
		pos(width()/2, height()-64),
		origin("center"),
		fixed(),
	])
  add([
		text("choose character by clicking", { size: 25 }),
		pos(width() / 2, height() / 2-128),
    origin("center"),
		fixed(),
	])
  //sprites

  function addSprite(s, w, h, si) {

	const btn = add([
		sprite(s),
		pos(w,h),
		area({ cursor: "pointer", }),
		scale(2),
		origin("center"),
	])
    btn.onClick(()=>spr = s)
    btn.onClick(()=>{
      music.pause()
        go("instructions", spr)
    })
	btn.onUpdate(() => {
		if (btn.isHovering()) {
			btn.scale = vec2(2.1)
      spr = s
		} else {
			btn.scale = vec2(2)
		}
	})

}

  	const sprLabel = add([
		text("Character: " + spr),
		pos(width()/2, height()-128),
      origin("center"),
	])
	onUpdate(() => {
		sprLabel.text = "Character: " + spr
	})

addSprite("smile", width()/4.5, height()/2)
addSprite("kid1", width()/2.5, height()/2)
addSprite("trollface", width()/1.8, height()/2)
  //make sprite
addSprite("bean", width()/1.1, height()/2)
// reset cursor to default at frame start for easier cursor management
  
onUpdate(() => cursor("default"))


})

scene("battle", (spr) => {
  let adrenaline = false
    let background = add([
    sprite("sky3", {width: width(), height: height()}),
    "back",
  ])
  onUpdate(()=>{
    if(adrenaline){
      background.color = rgb(255, 0, 0)
    }
    else{
      background.color = rgb(255,255,255)
    }
  })
  let music = play("milkyways", {
	loop: true,
  volume: 0.3,
})
  onUpdate(()=>{
      if(adrenaline){
    music.detune(-500)
    music.volume(0.6)
  }
  else{
    music.detune(0)
    music.volume(0.3)
  }
  })

  const BULLET_SPEED = 1200
	let PLAYER_SPEED = 480
  let enemydmg = 0
  let type = "normal"
  let bulletdmg = 1
  let kills = 0
  let cantMove = false
  let canSpawn = true
  let active = false
  let doublekills = false
  let doublescore = false
  let canShoot = true


//PLAYER OBJECT
const player = add([
	sprite(spr),
  health(100),
  area(),
  state("normal"),
  solid(),
	pos(center()),
])
  player.onStateEnter("normal", async () => {
    if(score>=20000){
      player.enterState("boss")
    }
  })
  
//CONTROLS
onKeyDown("left", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(-PLAYER_SPEED, 0)
  }
})

onKeyDown("right", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(PLAYER_SPEED, 0)
  }
})

onKeyDown("up", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(0, -PLAYER_SPEED)
  }
	
})

onKeyDown("down", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(0, PLAYER_SPEED)
  }
})

onKeyDown("a", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(-PLAYER_SPEED, 0)
  }
})

onKeyDown("d", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(PLAYER_SPEED, 0)
  }
})

onKeyDown("w", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(0, -PLAYER_SPEED)
  }
})

onKeyDown("s", () => {
  if(cantMove){
    shake(5)
  }
  else{
    player.move(0, PLAYER_SPEED)
  }
})


  
//BULLETS  
let currentBullet = "normal"
	function spawnBulletNormal(p, m) {
		add([
      bulletdmg = 1,
      type = "normal",
			rect(24, 12),
			area(),
			pos(p),
			origin("center"),
			color(127, 127, 255),
			outline(4),
			move(m, BULLET_SPEED),
			cleanup(),
			"bullet",
		])  
	}

  	function spawnBulletCone(p, m, spr) {
		add([
      bulletdmg = 0.5,
      type = "cone",
			sprite(spr),
			area(),
			pos(p),
			origin("center"),
			move(m, BULLET_SPEED/2),
			cleanup(),
			"bullet",
		])   
	}

	function spawnBulletBig(p, m) {
		add([
      bulletdmg = 5,
      type = "big",
			rect(100, 50),
			area(),
			pos(p),
			origin("center"),
			color(127, 127, 255),
			outline(8),
			move(m, BULLET_SPEED/4),
			cleanup(),
			"bullet",
		])
	}
//MAKE CARDINAL BULLET SPRITE
    	function spawnBulletCardinal(p, m) {
		add([
      bulletdmg = 2,
      type = "cardinal",
			sprite("cardinalbullet"),
			area(),
			pos(p),
			origin("center"),
			move(m, BULLET_SPEED),
			cleanup(),
			"bullet",
		])   
	}

  
	onKeyPress("space", () => {
    if(canShoot){
          if(currentBullet == "normal"){
		spawnBulletNormal(player.pos.add(64, 10), RIGHT)
		spawnBulletNormal(player.pos.add(64, 50), RIGHT)
    }
    if(currentBullet== "cone"){
      spawnBulletCone(player.pos.add(64,32), player.pos.angle(45), "conebullet45")
      spawnBulletCone(player.pos.add(64,32), RIGHT, "conebullet0")
      spawnBulletCone(player.pos.add(64,32),player.pos.angle(270), "conebullet-45")
    }
    if(currentBullet == "big"){
      spawnBulletBig(player.pos.add(64,32), RIGHT)
    }
    if(currentBullet=="cardinal"){
      spawnBulletCardinal(player.pos.add(32, 0), UP)
      spawnBulletCardinal(player.pos.add(64, 32), RIGHT)
      spawnBulletCardinal(player.pos.add(32, 64), DOWN)
      spawnBulletCardinal(player.pos.add(0, 32), LEFT)
    }
    }
	})
    



  //ADD PLAYER STATES



  //ENEMIES
	function spawnSmile() {
    enemydmg = 20
    value = 100
		add([
			sprite("evilsmile"),
			area(),
			pos(width()-64, rand(0,height())),
			health(2),
			"evilsmileenemy",
			"enemy",
			{ speed: 180 },
		])
  }
  	function spawnSadSmile() {
    enemydmg = 33
    value = 250
		add([
			sprite("sadsmile"),
			area(),
			pos(width()-64, rand(0,height())),
			health(10),
			"sadsmileenemy",
			"enemy",
			{ speed: 100 },
		])
  }

    	function spawnMan() {
        enemydmg = 33
        value = 1000
		add([
			sprite("manface"),
			area(),
			pos(width()-64, rand(0,height())),
			health(5),
			"manenemy",
			"enemy",
			{ speed: 1000 },
		])
  }

  function spawnAngry() {
    enemydmg = 33
    value = 500
		add([
			sprite("angry"),
			area(),
			pos(width()-64, rand(0,height())),
			health(30),
			"angryenemy",
			"enemy",
			{ speed: 60 },
		])
  }
  	onUpdate("enemy", (t) => {
      if(enemydmg==75){
      }
      else{
        if(adrenaline){
          t.move(-t.speed*2, 0)
		      if (t.pos.x - t.width > width()) {
			      destroy(t)
		      }
        }
        else{
          t.move(-t.speed, 0)
		      if (t.pos.x - t.width > width()) {
			      destroy(t)
		      }
        }

      }

	})

	const timere = add([
		text(0),
		pos(width()-64, height()-64),
    origin("center"),
		fixed(),
		{ time: 0, },
	])
let ttime = 0;
	timere.onUpdate(() => {
		timere.time += dt()
		timere.text = timere.time.toFixed(2)
	})

  
  //SCORE
    let score = 0;
  
  	const scoreLabel = add([
		text("Score: " + score),
		pos(28, 64),
      scale(0.5),
	])
	onUpdate(() => {
		scoreLabel.text = "Score: " + score
	})
  const killsLabel = add([
		text("Enemies killed: " + kills),
		pos(28, 96),
    scale(0.5),
	])
	onUpdate(() => {
		killsLabel.text = "Enemies killed: " + kills
	})
  onUpdate(()=>{
      if((score%1000==0 || score%1000==50) && score!=0){
        spawnBulletPowerUp()
          score+=100
      }
    if(kills%10==0 && kills!=0){
      spawnShieldPowerUp()
      kills++
    }
    if(kills%15==0 && kills!=0){
      spawnHealOrb()
      kills++
    }
  })
  function spawnHealOrb(){
		add([
			sprite("healorb"),
			area(),
			pos(width()-64, rand(0,height())),
      cleanup(),
			"healer",
      "box",
			{ speed: 120 },
		])}
  player.onCollide("healer", (h)=>{
    if(adrenaline){
      destroy(h)
    }
    else{
      player.heal(15)
    play("heal", {
      detune: 500
    })
    healthbar.set(player.hp())
    destroy(h)
    }

  })
  
  
	function spawnBulletPowerUp() {
		add([
			sprite("powerbox"),
			area(),
			pos(width()-64, rand(0,height())),
      cleanup(),
			"power",
      "box",
			{ speed: 120 },
		])}
player.onCollide("power", (p) => {
  destroy(p)
  play("bulletchange")
  let c = choose(objs)
  while(c==currentBullet){
    c = choose(objs)
  }
  currentBullet = c
})

function spawnShieldPowerUp(){
  		add([
			sprite("shieldbox"),
			area(),
			pos(width()-64, rand(0,height())),
        cleanup(),
			"box",
        "shield",
			{ speed: 120 },
		])}
  let shielddeath = false
  let shieldactive = false
  function spawnShield(){
     shieldactive = true
    let m = add([
      sprite("bubble"),
      area(),
      scale(1.3),
      pos(player.pos),
    ])
    onUpdate(() => {
    m.pos.x= player.pos.x-24
      m.pos.y = player.pos.y-24
   })
  	m.onCollide("enemy", (e) => {
    if(enemydmg==75){
      destroy(m)
      e.hurt(e.hp()/2)
    }

      else{
            destroy(e)
		addExplode(e.pos, 1, 12, 1)
    shielddeath = true
    e.hurt(e.hp())
      }
    m.onCollide("enemybullet", (b) => {
    destroy(b)
    })

	})
    let t
  if(randomactive){
    t = add([
       text("Shield:"),
      pos(width()/3, 128),
      scale(0.5)
    ])
   makeStopwatch(5, width()/3, 160)
  }
  else{
     t = add([
      text("Shield:"),
      pos(width()/3, 32),
      scale(0.5)
    ])
    makeStopwatch(5, width()/3, 64)
  }
  play("shieldrecharge", {
    volume: 10
  })
    wait(5, ()=>{
      destroy(t)
      destroy(m)
      shieldactive = false
    })
  }
  player.onCollide("shield", (s) => {
    destroy(s)
    spawnShield()
})
  
    onUpdate("box", (t) => {
		t.move(-t.speed, 0)
	})




function spawnRandomPowerUp(){
  		add([
			sprite("randombox"),
			area(),
			pos(width()-64, rand(0,height())),
      cleanup(),
			"box",
      "random",
			{ speed: 120 },
		])}

  loop(15, ()=>{
    spawnRandomPowerUp()
  })
  let randomactive = false
player.onCollide("random", (p) => {
  /*play("jackitup", {
    volume: 1
  })*/
  randomactive = true
  destroy(p)
  let t
  let te
  if(shieldactive){
    te = add([
      text("PowerUp:"),
      pos(width()/3, 128),
      scale(0.5)
    ])
      t = makeStopwatch(5, width()/3, 160)
  }
  else{
    te = add([
      text("PowerUp:"),
      pos(width()/3, 32),
      scale(0.5)
    ])
      t = makeStopwatch(5, width()/3, 64)
  }
  let c = choose(options)
  wait(5,()=>{
    destroy(te)
    randomactive = false
  })
  if(c=="changeBullet"){
    play("bulletchange")
        add([
      text("Bullet Change!"),
      pos(width()/2, 64),
      fixed(),
      lifespan(3, {fade: 0.5}),
    ])
    let temp = currentBullet
    currentBullet = choose(objs)
    wait(5, ()=>{
      currentBullet = temp
      play("bulletchange")
    })
  }
  if(c=="doubleScore"){
        add([
      text("Double Score!"),
      pos(width()/1.8, 64),
      fixed(),
      scale(0.8),
      lifespan(3, {fade: 0.5}),
    ])
    doublescore=true
    wait(5, ()=>{
      doublescore = false
    })

  }
  if(c=="doubleKills"){
        add([
      text("Double Kills!"),
      pos(width()/2, 64),
      lifespan(3, {fade: 0.5}),
      ])
    doublekills = true
        wait(5, ()=>{
    doublekills = false
    })

  }
  if(c=="spawnShield"){
            add([
      text("Shield!"),
      pos(width()/2, 64),
      fixed(),
      lifespan(3, {fade: 0.5}),
    ])
    destroy(t)
    spawnShield()

  }
  if(c=="cantMove"){
            add([
      text("Glue!"),
      pos(width()/2, 64),
      fixed(),
      lifespan(3, {fade: 0.5}),
    ])
    cantMove=true
    canShoot = false
        wait(5, ()=>{
      cantMove = false
          canShoot = true
    })

  }
  if(c == "canSpawn"){
                add([
      text("Enemies Stopped!"),
      pos(width()/2, 64),
      fixed(),
      lifespan(3, {fade: 0.5}),
    ])
    canSpawn=false
            wait(5, () =>{
      canSpawn = true
    })

  }
  if(c=="cantShoot"){
    canShoot = false
        add([
      text("No Guns!"),
      pos(width()/2, 64),
      fixed(),
      lifespan(3, {fade: 0.5}),
    ])
    wait(5,()=>{
      canShoot = true
    })
  }
  if(c=="heal"){
            add([
      text("Health Restored!"),
      pos(width()/2, 64),
      fixed(),
      lifespan(3, {fade: 0.5}),
    ])
    player.heal(100-player.hp())
  play("heal")
    healthbar.set(player.hp())
    destroy(t)
  }
  if(c=="doublespeed"){
      add([
      text("Double Speed!"),
      pos(width()/2, 64),
      fixed(),
      lifespan(3, {fade: 0.5}),
    ])
    PLAYER_SPEED*=2
    wait(5,()=>{
      PLAYER_SPEED= PLAYER_SPEED/2
    })
  }
  if(c=="adrenaline"){
    destroy(te)
  if(shieldactive){
    tex = add([
      text("PowerUp:"),
      pos(width()/3, 128),
      scale(0.5),
      lifespan(10),
    ])
      tm = makeStopwatch(10, width()/3, 160)
  }
  else{
    tex= add([
      text("PowerUp:"),
      pos(width()/3, 32),
      scale(0.5),
      lifespan(10),
    ])
      tm = makeStopwatch(10, width()/3, 64)
  }
    doublescore = true
    doublekills = true
                add([
      text("ADRENALINE!", {
      transform: (idx, ch) => ({
			color: rgb(60, 0 , 0),
			pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
			scale: wave(1, 1.2, time() * 3 + idx),
			angle: wave(-9, 9, time() * 3 + idx),
		}),
	}),
      pos(width()/2, 64),
      fixed(),
      lifespan(10),
    ])
    adrenaline = true
    let temp = player.hp()-0.000001
    player.hurt(temp)
    wait(10, ()=>{
      player.heal(temp)
      healthbar.set(player.hp())
      doublescore = false
      doublekills = false
      adrenaline = false
    })
  }
})
const options = [
"changeBullet",
"doubleScore",
"doubleKills",
"spawnShield",
"cantMove",
"cantShoot",
"heal",
  "doublespeed",
"adrenaline"
]

  //ADD FUNCTION TO CREATE TURRET THAT SWIRLS AROUND PLAYER AT CERTAIN SCORE?
  function makeStopwatch(time, x, y){
    const timer = add([
		text(0),
      scale(1),
		pos(x, y),
		fixed(),
		{ time: time, },
    active = true
	])
    timer.onUpdate(() => {
		timer.time -= dt()
		timer.text = timer.time.toFixed(2)
	})
    wait(time, ()=>{
      destroy(timer)
      active = false
    })
  }


  //HEALTHBAR
	const healthbar = add([
		rect(width()/4, 32),
    outline(2),
		pos(32, 32),
		color(127, 255, 127),
		fixed(),
		{
			max: player.hp(),
			set(hp) {
				this.width = width()/4 * hp / this.max
				this.flash = true
			},
		},
	])

	healthbar.onUpdate(() => {
    
		if (healthbar.flash) {
			healthbar.color = rgb(255, 255, 255)
      
			healthbar.flash = false
      
		} else {
			healthbar.color = rgb(127, 255, 127)
      
		}
	})


  //EXPLODE & GROW FUNCTIONS
	function addExplode(p, n, rad, size) {
		for (let i = 0; i < n; i++) {
			wait(rand(n * 0.1), () => {
				for (let i = 0; i < 2; i++) {
					add([
						pos(p.add(rand(vec2(-rad), vec2(rad)))),
						rect(4, 4),
						outline(4),
						scale(1 * size, 1 * size),
						lifespan(0.1),
						grow(rand(48, 72) * size),
						origin("center"),
					])
				}
			})
		}
	}
  
	function grow(rate) {
		return {
			update() {
				const n = rate * dt()
				this.scale.x += n
				this.scale.y += n
			},
		}
	}


const sounders = [
  "hurt1", "hurt2", "hurt3"
]
  //COLLISIONS/HURT
  player.onHurt(() => {
    healthbar.set(player.hp())
    play(choose(sounders), {
      volume: 2
    })
    if(player.hp()<=0){
      music.pause()
      destroy(timere)
      go("lose", score, kills, timer)
      
    }
	})
	const widthwall = add([
		rect(0, height()),
		pos(0, 0),
    solid(),
    area(),
    "wall",
    ])
  	const widthwall2 = add([
		rect(0, height()),
		pos(width(), 0),
    solid(),
    area(),
    "wall",
    ])
  	const heightwall = add([
		rect(width(), 0),
		pos(0, 0),
    solid(),
    area(),
    "wall",
    ])
  	const heightwall2 = add([
		rect(width(), 0),
		pos(0, height()),
    solid(),
    area(),
    "wall",
    ])
  
player.onCollide("enemy", (enemy) => {
  if(enemydmg==75){
    player.hurt(enemydmg)
    shake(5)
    if(player.pos.x>210){
      player.pos.x-200
    }
    else{
      player.pos.x+200
    }
    
  }
  else{
  destroy(enemy)
  player.hurt(enemydmg)
  shake(enemydmg/5)
  }

})

  	onCollide("bullet", "enemy", (b, e) => {
      
    destroy(b)
    e.hurt(bulletdmg)
		addExplode(b.pos, 1, 12, 1)
	})
  	on("death", "enemy", (e) => {
      play("edeath")
		destroy(e)
		shake(2)
    if(doublekills){
        kills+=2
      }
      else{
        kills++
      }
    })
  	on("death", "evilsmileenemy", () => {
      if(doublescore){
          score+=200
        }
        else if(shielddeath){
          score+=50
          shielddeath = false
        }
        else{
          score+=100
        }
    })
  	on("death", "sadsmileenemy", () => {
        if(doublescore){
          score+=400
        }
        else if(shielddeath){
          score+=100
          shielddeath = false
        }
        else{
          score+=200
        }
    })
  	on("death", "angryenemy", () => {
        if(doublescore){
          score+=2000
        }
        else if(shielddeath){
          score+=500
          shielddeath = false
        }
        else{
          score+=1000
        }
    })
  	on("death", "manenemy", () => {
      if(doublescore){
          score+=6000
        }
        else if(shielddeath){
          score+=1500
          shielddeath = false
        }
        else{
          score+=3000
        }
    })
  	on("death", "boss", () => {
      ttime = timere.time
      add([
        
        text("The boss has been defeated..."),
        pos(width()/10, height()-100),
        lifespan(3, {fade: 0.5}),
      ])
      wait(5, ()=>{
        music.pause()
        go("win", kills)
      })
    })

  
	on("hurt", "enemy", (e) => {
		shake(1)
	})


  //SPAWN FUNCTIONS
  loop(1, ()=>{
    if(canSpawn){
    spawnSmile()
    }
  })
  wait(5,()=>{
  loop(8, ()=>{
    if(canSpawn){
    spawnSadSmile()
    }
  })
  })
  wait(10, ()=>{
      loop(15, ()=>{
    if(canSpawn){
    spawnAngry()
    }
  })
  })

  wait(12, ()=>{
      loop(15, ()=>{
    if(canSpawn){
    spawnMan()
    }
  })
  })

          player.onCollide("enemybullet", (b)=>{
            destroy(b)
            player.hurt(bulletdmg)
            shake(2)
          })
  function spawnBoss() {

        enemydmg = 75
		  boss = add([
			sprite("robertboss"),
			area(),
			pos(width(), height()/2),
			health(200),
        state("moveattack"),
			"boss",
      "enemy",
			{ speed: 120 },
		])
    
// When we enter "attack" state, we fire a bullet, and enter "move" state after 1 sec
    boss.onStateEnter("idle", async ()=>{
      if(boss.hp()>0){
        boss.enterState("moveattack")
      }
    })
boss.onStateEnter("moveattack", async () => {

	// Don't do anything if player doesn't exist anymore
	if (player.exists()) {
		

      let dir = player.pos.sub(boss.pos).unit()
      add([
      bulletdmg = 10,
			pos(boss.pos.x+32, boss.pos.y+32),
			move(dir, BULLET_SPEED),
			sprite("manface"),
			area(),
			cleanup(),
			"enemybullet",
		])
	}
  wait(1,()=>{
    boss.enterState("idle")
  })

})

// Like .onUpdate() which runs every frame, but only runs when the current state is "move"
// Here we move towards the player every frame if the current state is "move"
boss.onStateUpdate("moveattack", () => {
	if (!player.exists()) return
	const dir = player.pos.sub(boss.pos).unit()
  if(adrenaline){
    boss.move(dir.scale(200))
  }
  else{
    boss.move(dir.scale(100))
  }
	
})

// Have to manually call enterState() to trigger the onStateEnter("move") event we defined above.
boss.enterState("moveattack")
        const bosshealthbar = add([
		rect(width(), 32),
    outline(2),
		pos(0, height()-64),
		color(255, 0, 0),
		fixed(),
		{
			max: boss.hp(),
			set(hp) {
				this.width = width() * hp / this.max
				this.flash = true
			},
		},
	])
  bosshealthbar.onUpdate(() => {
		if (bosshealthbar.flash) {
			bosshealthbar.color = rgb(255, 255, 255)
			bosshealthbar.flash = false
		} else {
			bosshealthbar.color = rgb(255, 0, 0)
		}
	})
  boss.onHurt(() => {
		bosshealthbar.set(boss.hp())
    })
  }
let bossactive = false
  let boss
  onUpdate(()=>{
    if(score>=5000){
      bossactive = true
    }
  })

  onUpdate(()=>{
  if(bossactive){
    onUpdate(()=>{
      score="ERROR"
    })
    canSpawn = false
    bossactive = false
    let d = add([
      text("Doom approaches..."),
      pos(width()/4, height()/2),
      lifespan(3, { fade: 0.5 }),
    ])
    music.pause()
    music = play("galaxyboss", {
	loop: true,
      volume: 1.5
})
    shake(5)
    wait(1, ()=>{
      shake(5)
    })
        wait(2, ()=>{
      shake(5)
    })
        wait(3, ()=>{
      shake(5)
    })
        wait(4, ()=>{
      shake(5)
      loop(10, ()=>{
        spawnBulletPowerUp()
      })
          spawnBoss()
    })
  }
  })


  
})






//LOSE SCENE
scene("lose", (score, kills) => {
    let background = add([
    sprite("gameover", {width: width(), height: height()})
  ])
  let music = play("death")
  add([
		text("Press R to restart", { size: 50 }),
		pos(width() / 2, (height() / 2)+76),
    origin("center"),
		fixed(),
	])
  	// display score
	add([
		text("Score: " + score, {size: 50 }),
		pos(width() / 2, height() / 2 + 128),
		origin("center"),
	])
  	add([
		text("Enemies killed: " + kills, {size: 50 }),
		pos(width() / 2, height() / 2 + 196),
		origin("center"),
	])

	// go back to game with space is pressed
	onKeyPress("r", () =>{
    attempt++
    music.pause()
    go("menu")
  })
  
})
scene("instructions", (spr) => {
  let background = add([
    sprite("book", {width: width(), height: height()})
  ])
  let music = play("clash", {
    loop: true
  })
	add([
		text("INSTRUCTIONS", { size: 100 }),
		pos(28, 32),
		fixed(),
	])
  add([
		text("Use WASD or Arrows Keys to move around", { size: 50 }),
		pos(28,128),
		fixed(),
	])
  	// display score
	add([
		text("Press Spacebar to shoot", {size: 50 }),
		pos(28, 196),
	])
  add([
		text("Kill enemies to increase your score and kill", {size: 50 }),
		pos(28, 256),
	])
    add([
		text("count using different power-ups", {size: 50 }),
		pos(28, 320),
	])
  add([
		text("Reach 5000 score to win!", {size: 50 }),
		pos(28, 384),
	])
  add([
		text("Press space to begin", { size: 100 }),
		pos(width()/2, height()-64),
		origin("center"),
		fixed(),
	])

	// go back to game with space is pressed
	onKeyPress("space", () =>{
    music.pause()
    go("battle", spr)
  })
  
})
scene("win", (kills, ttime) => {
  let music = play("win")
  let background = add([
    sprite("manface", {width: width(), height: height()})
  ])
	add([
		text("YOU WIN!", { size: 160 }),
		pos(width() / 2, height() / 2),
		origin("center"),
		fixed(),
	])
  add([
		text("Press R to restart", { size: 50 }),
		pos(width() / 2, (height() / 2)+76),
    origin("center"),
		fixed(),
	])
  add([
		text("Enemies killed: " + kills, {size: 50 }),
		pos(width() / 2, height() / 2 + 196),
		origin("center"),
	])
  	// display score
  if(gamecount = 1){
    killshighscore=kills
    fastesttime = ttime
  }
  else{
    if(killhighscore<kills){
      killhighscore=kills
    }
    if(fastesttime<ttime){
      fastesttime=ttime
    }
  }
	// go back to game with space is pressed
	onKeyPress("r", () => {
    gamecount++
    attempt++
    go("menu")
    
  })
})

go("menu")

