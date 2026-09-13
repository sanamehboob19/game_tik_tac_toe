! function() {

    function getJsonFromUrl() {
        for (var a = {}, d = location.search.substr(1).split("&"), c = 0; c < d.length; c++) {
            var b = d[c].indexOf("="),
                b = [d[c].substring(0, b), d[c].substring(b + 1)];
            a[b[0]] = decodeURIComponent(b[1])
        }
        return a
    };
    SoundManager = function(a) {
        this.game = a;
        try {
            this.musicPlaying = this.soundPlaying = SOUNDS_ENABLED, localStorage.getItem(GameData.ProfileName + "-sounds") && (this.soundPlaying = SOUNDS_ENABLED && !0 === JSON.parse(localStorage.getItem(GameData.ProfileName + "-sounds"))), localStorage.getItem(GameData.ProfileName + "-music") && (this.musicPlaying = SOUNDS_ENABLED && !0 === JSON.parse(localStorage.getItem(GameData.ProfileName + "-music")))
        } catch (d) {
            this.musicPlaying = this.soundPlaying = SOUNDS_ENABLED
        }
        GameData.BuildDebug && (this.soundPlaying =
            this.musicPlaying = !1);
        this.music = [];
        this.sounds = [];
        this.prevSoundPlayed = this.actualMusic = null
    };
    SoundManager.prototype = {
        constructor: SoundManager,
        create: function() {
            this.addMusic("music_menu", .3, !0);
            this.addSound("menu-click1", .4);
            this.addSound("crossed", .4);
            this.addSound("droptoken", .4)
        },
        addMusic: function(a, d, c) {
            void 0 === c && (c = !1);
            this.music[a] = game.add.audio(a, d, c)
        },
        addSound: function(a, d, c) {
            void 0 === c && (c = !1);
            this.sounds[a] = game.add.audio(a, d, c)
        },
        playMusic: function(a, d) {
            void 0 === d && (d = !1);
            if (a != this.actualMusic || d) this.actualMusic = a;
            if (this.musicPlaying)
                for (var c in this.music) "contains" != c &&
                    (c == this.actualMusic ? this.music[c].isPlaying || this.music[c].play() : this.music[c].stop())
        },
        playSound: function(a) {
            if (this.soundPlaying) try {
                this.sounds[a].play()
            } catch (d) {
                LOG("Failed to play sound : " + a)
            }
        },
        pauseMusic: function() {
            if (this.musicPlaying)
                for (var a in this.music) "contains" != a && a == this.actualMusic && this.music[a].pause()
        },
        resumeMusic: function() {
            if (this.musicPlaying)
                for (var a in this.music) "contains" != a && a == this.actualMusic && this.music[a].resume()
        },
        stopMusic: function() {
            for (var a in this.music) "contains" !=
                a && this.music[a].stop()
        },
        toggleMusic: function(a) {
            this.musicPlaying ? (this.musicPlaying = !1, this.stopMusic()) : (this.musicPlaying = !0, this.playMusic(a));
            try {
                localStorage.setItem(GameData.ProfileName + "-music", this.musicPlaying)
            } catch (d) {}
        },
        toggleSounds: function() {
            if (this.soundPlaying) {
                this.soundPlaying = !1;
                for (var a in this.sounds) "contains" != a && this.sounds[a].stop()
            } else this.soundPlaying = !0;
            try {
                localStorage.setItem(GameData.ProfileName + "-sounds", this.soundPlaying)
            } catch (d) {}
        }
    };
    var DIFFS = [1, 2, 3],
        AIPlayer = function() {};
    AIPlayer.prototype = {
        GetNextMove: function() {
            var a = SceneGame.instance.GetBoardMatrix(),
                a = this.MinimaxAlphabeta(a, DIFFS[gameDifficulty - 1], {
                    score: -9999999
                }, {
                    score: 9999999
                }, 0 != DIFFS[gameDifficulty - 1] % 2);
            if (2 < GameTurns) return a;
            if (a.hasOwnProperty("allMoves")) {
                a.allMoves.sort(function(a, c) {
                    return c.score - a.score
                });
                var d = a.allMoves[0].score,
                    c = [];
                do {
                    for (var b = 0; b < a.allMoves.length; b++) a.allMoves[b].score == d && c.push(a.allMoves[b]);
                    d--
                } while (2 > GameTurns && 2 > c.length);
                return c[getRandomUInt(c.length)]
            }
            return a
        },
        PrintBoard: function(a, d) {},
        GetScore4x: function(a) {
            function d(a, c) {
                var b = 0;
                switch (Math.floor(a)) {
                    case 7:
                    case 6:
                    case 5:
                    case 4:
                        b += WINNING_SCORE;
                        break;
                    case 3:
                        b += 100;
                        break;
                    case 2:
                        b += 10;
                        break;
                    default:
                        b += 10 * (a - Math.floor(a))
                }
                switch (Math.floor(c)) {
                    case 7:
                    case 6:
                    case 5:
                    case 4:
                        b -= .9 * WINNING_SCORE;
                        break;
                    case 3:
                        b -= 90;
                        break;
                    case 2:
                        b -= 9;
                        break;
                    default:
                        b -= 10 * (c - Math.floor(c))
                }
                return b
            }

            function c(a, c, e) {
                1 == a[c][e] ? (3 < g && (b += d(0, g)), 0 == f && (f += .1 * k), f++, k = g = 0) : 2 == a[c][e] ? (3 < f && (b += d(f, 0)), 0 == g && (g += .1 * k), g++, k = f = 0) :
                    (k++, g += 0 < g ? .1 : 0, f += 0 < f ? .1 : 0, b += d(f, g), f = g = k = 0)
            }
            for (var b = 0, e = 0; e < GAME_SIZE[gameSize]; e++) {
                for (var f = 0, g = 0, k = 0, h = 0; h < GAME_SIZE[gameSize]; h++) c(a, e, h);
                b += d(f, g);
                if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b
            }
            for (h = 0; h < GAME_SIZE[gameSize]; h++) {
                for (e = k = g = f = 0; e < GAME_SIZE[gameSize]; e++) c(a, e, h);
                b += d(f, g);
                if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b
            }
            for (var l = 0; l < GAME_SIZE[gameSize]; l++) {
                for (h = k = g = f = 0; h < GAME_SIZE[gameSize] && 4 <= GAME_SIZE[gameSize] - l && h + l < GAME_SIZE[gameSize]; h++) c(a, h + l, h);
                b += d(f, g);
                if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b;
                if (0 < l)
                    for (e = k = g = f = 0; e < GAME_SIZE[gameSize] && 4 <= GAME_SIZE[gameSize] - l && e + l < GAME_SIZE[gameSize]; e++) c(a, e, e + l);
                b += d(f, g);
                if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b
            }
            for (l = 0; l < GAME_SIZE[gameSize]; l++) {
                for (h = k = g = f = 0; h < GAME_SIZE[gameSize] && 4 <= GAME_SIZE[gameSize] - l && h + l < GAME_SIZE[gameSize]; h++) c(a, h + l, GAME_SIZE[gameSize] - 1 - h);
                b += d(f, g);
                if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b;
                if (0 < l) {
                    for (e = k = g = f = 0; e < GAME_SIZE[gameSize] && 4 <= GAME_SIZE[gameSize] - l &&
                        e + l < GAME_SIZE[gameSize]; e++) c(a, e, GAME_SIZE[gameSize] - 1 - (e + l));
                    b += d(f, g);
                    if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b
                }
            }
            return b = Math.floor(100 * b) / 100
        },
        GetScore3x: function(a) {
            function d(a, c) {
                var b = 0;
                switch (a) {
                    case 3:
                        b += WINNING_SCORE;
                        break;
                    case 2:
                        b += 5;
                        break;
                    case 1:
                        b += 1
                }
                switch (c) {
                    case 3:
                        b -= WINNING_SCORE;
                        break;
                    case 2:
                        b -= 5;
                        break;
                    case 1:
                        --b
                }
                return b
            }

            function c(a, c, b) {
                1 == a[c][b] ? (0 == f && (f += .1 * k), f++, k = g = 0) : 2 == a[c][b] ? (0 == g && (g += .1 * k), g++, k = f = 0) : (k++, g += 0 < g ? .1 : 0, f += 0 < f ? .1 : 0)
            }
            for (var b = 0, e = 0; e < GAME_SIZE[gameSize]; e++) {
                for (var f =
                        0, g = 0, k = 0, h = 0; h < GAME_SIZE[gameSize]; h++) c(a, e, h);
                b += d(f, g);
                if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b
            }
            for (h = 0; h < GAME_SIZE[gameSize]; h++) {
                for (e = k = g = f = 0; e < GAME_SIZE[gameSize]; e++) c(a, e, h);
                b += d(f, g);
                if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b
            }
            for (h = k = g = f = 0; h < GAME_SIZE[gameSize]; h++) c(a, h, h);
            b += d(f, g);
            if (b <= -WINNING_SCORE || b >= WINNING_SCORE) return b;
            for (h = k = g = f = 0; h < GAME_SIZE[gameSize]; h++) c(a, GAME_SIZE[gameSize] - 1 - h, h);
            return b += d(f, g)
        },
        MinimaxMax: function(a, d) {
            return a.score > d.score ? JSON.parse(JSON.stringify(a)) :
                JSON.parse(JSON.stringify(d))
        },
        MinimaxMin: function(a, d) {
            return a.score < d.score ? JSON.parse(JSON.stringify(a)) : JSON.parse(JSON.stringify(d))
        },
        BoardPlaceMove: function(a, d, c, b, e) {
            a = e ? JSON.parse(JSON.stringify(a)) : a;
            return 0 == a[b][c] ? (a[b][c] = d, a) : !1
        },
        MinimaxAlphabeta: function(a, d, c, b, e) {
            this.PrintBoard(a, d);
            for (var f = 3 == GAME_SIZE[gameSize] ? this.GetScore3x(a) : this.GetScore4x(a), g = [], k = e ? HUMAN_PLAYER : COMPUTER_AI, h = 0; h < GAME_SIZE[gameSize]; h++)
                for (var l = 0; l < GAME_SIZE[gameSize]; l++) {
                    var n = GAME_SIZE[gameSize] *
                        h + l,
                        m = this.BoardPlaceMove(a, k, h, l, !0);
                    m && (g[n] = m)
                }
            a = 0 == g.length;
            if (0 == d || a || f <= -WINNING_SCORE || f >= WINNING_SCORE) return {
                columnMove: null,
                score: f
            };
            f = [];
            if (e)
                for (e = {
                        rowMove: null,
                        columnMove: null,
                        score: -99999
                    }, a = 0; a < g.length; a++) {
                    if (g[a]) {
                        k = this.MinimaxAlphabeta(g[a], d - 1, c, b, !1);
                        h = Math.floor(a / GAME_SIZE[gameSize]);
                        l = a % GAME_SIZE[gameSize];
                        if (k.score > e.score || null == e.columnMove) e.rowMove = l, e.columnMove = h, e.score = k.score;
                        f.push({
                            rowMove: l,
                            columnMove: h,
                            score: k.score
                        });
                        c = this.MinimaxMax(c, k);
                        if (b.score <= c.score) break
                    }
                } else
                    for (e = {
                            rowMove: null,
                            columnMove: null,
                            score: 99999
                        }, a = 0; a < g.length; a++)
                        if (g[a]) {
                            k = this.MinimaxAlphabeta(g[a], d - 1, c, b, !0);
                            h = Math.floor(a / GAME_SIZE[gameSize]);
                            l = a % GAME_SIZE[gameSize];
                            if (k.score < e.score || null == e.columnMove) e.rowMove = l, e.columnMove = h, e.score = k.score;
                            f.push({
                                rowMove: l,
                                columnMove: h,
                                score: k.score
                            });
                            b = this.MinimaxMin(b, k);
                            if (b.score <= c.score) break
                        }
            d == DIFFS[gameDifficulty - 1] && (e.allMoves = f);
            return e
        }
    };
    Particles = function(a) {
        this.MAX_PARTICLES = 100;
        Phaser.Device.desktop || (this.MAX_PARTICLES = 50);
        this.objParticles = [];
        this._init();
        Particles.instance = this
    };
    Particles.instance = null;
    Particles.prototype = {
        constructor: Particles,
        _init: function(a) {
            this.grpParticles = game.add.group();
            a = {
                tag: "",
                velX: 0,
                velY: 0,
                accX: 0,
                accY: 0,
                sprite: "pak",
                frameName: "particle_smallest.png"
            };
            for (var d = 0; d < this.MAX_PARTICLES; d++) this.CreateParticle(0, 0, a);
            for (d = 0; d < this.MAX_PARTICLES; d++) this.objParticles[d].sprite.visible = !1
        },
        CreateParticle: function(a, d, c) {
            c.hasOwnProperty("tag") || (c.tag = "");
            c.hasOwnProperty("frame") || (c.frame = 0);
            c.hasOwnProperty("blendMode") || (c.blendMode = PIXI.blendModes.NORMAL);
            c.hasOwnProperty("life") ||
                (c.life = 500 + getRandomUInt(200));
            c.hasOwnProperty("velX") || (c.velX = 0);
            c.hasOwnProperty("velY") || (c.velY = 0);
            c.hasOwnProperty("accX") || (c.accX = 0);
            c.hasOwnProperty("accY") || (c.accY = 0);
            c.hasOwnProperty("rotation") || (c.rotation = 0);
            c.hasOwnProperty("scale") ? (c.scale.hasOwnProperty("start") || (c.scale.start = 1), c.scale.hasOwnProperty("end") || (c.scale.end = c.scale.start)) : c.scale = {
                start: 1,
                end: 1
            };
            c.scale.delta = c.scale.start - c.scale.end;
            c.hasOwnProperty("alpha") ? (c.alpha.hasOwnProperty("start") || (c.alpha.start =
                1), c.alpha.hasOwnProperty("end") || (c.alpha.end = c.alpha.start)) : c.alpha = {
                start: 1,
                end: 1
            };
            c.alpha.delta = c.alpha.start - c.alpha.end;
            for (var b = null, e = 0; e < this.objParticles.length && null == b; e++) this.objParticles[e].sprite.visible || (b = this.objParticles[e], b.sprite.key != c.sprite && b.sprite.loadTexture(c.sprite), b.sprite.frame = c.frame, c.hasOwnProperty("frameName") && (b.sprite.frameName = c.frameName));
            if (null === b) {
                if (this.objParticles.length == this.MAX_PARTICLES) return null;
                b = this.objParticles[this.objParticles.length] = {};
                b.sprite = this.grpParticles.create(-100, -100, c.sprite, c.frame);
                b.sprite.anchor.set(.5);
                c.hasOwnProperty("frameName") && (b.sprite.frameName = c.frameName)
            }
            game.world.bringToTop(b.sprite);
            b.sprite.visible = !0;
            b.sprite.alpha = c.alpha.start;
            b.sprite.angle = 0;
            b.sprite.x = a;
            b.sprite.y = d;
            b.sprite.scale.set(1);
            b.sprite.tint = 16777215;
            b.sprite.blendMode = c.blendMode;
            b.data = c;
            b.data.lifeInit = c.life;
            return b
        },
        Reset: function() {
            for (var a = 0; a < objParticles.length; a++) this.objParticles[a].sprite.visible = !1
        },
        GetActiveCount: function(a) {
            a =
                a || null;
            for (var d = 0, c = 0; c < this.objParticles.length; c++)(null == a || this.objParticles[c].data.tag == a) && this.objParticles[c].sprite.visible && 0 < objParticles[c].data.life && d++;
            return d
        },
        Update: function() {
            for (var a = 0; a < this.objParticles.length; a++) this.objParticles[a].sprite.visible && (this.objParticles[a].data.life -= game.time.elapsedMS, 0 >= this.objParticles[a].data.life ? this.objParticles[a].sprite.visible = !1 : (this.objParticles[a].sprite.alpha = this.objParticles[a].data.alpha.start - this.objParticles[a].data.alpha.delta +
                this.objParticles[a].data.life / this.objParticles[a].data.lifeInit * this.objParticles[a].data.alpha.delta, this.objParticles[a].sprite.scale.set(this.objParticles[a].data.scale.start - this.objParticles[a].data.scale.delta + this.objParticles[a].data.life / this.objParticles[a].data.lifeInit * this.objParticles[a].data.scale.delta), this.objParticles[a].sprite.angle += this.objParticles[a].data.rotation, this.objParticles[a].sprite.x += this.objParticles[a].data.velX, this.objParticles[a].sprite.y += this.objParticles[a].data.velY,
                this.objParticles[a].data.velX += this.objParticles[a].data.accX, this.objParticles[a].data.velY += this.objParticles[a].data.accY))
        },
        Destroy: function() {
            for (var a = 0; a < this.objParticles.length; a++) this.objParticles[a].sprite.destroy(), this.objParticles[a].sprite = null, this.objParticles[a] = null;
            this.objParticles = null
        },
        CreateBubbles: function(a, d, c, b, e, f) {
            f = f || PIXI.blendModes.NORMAL;
            for (b = (b || 10) - 1; 0 <= b; b--) {
                tmpX = game.rnd.integerInRange(-100, 100) / 30;
                tmpY = game.rnd.integerInRange(50, 100) / 1E3;
                var g = (5 + getRandomUInt(5)) /
                    10,
                    k = (2 + getRandomUInt(5)) / 10,
                    g = {
                        velX: 0,
                        velY: -tmpY,
                        accX: 0,
                        accY: 0 >= tmpY ? .01 : -.01,
                        sprite: "pak",
                        frameName: "particle_smallest.png",
                        blendMode: f,
                        rotation: 4,
                        scale: {
                            start: g,
                            end: g
                        },
                        alpha: {
                            start: k,
                            end: k
                        },
                        life: e
                    },
                    g = this.CreateParticle(a + game.rnd.integerInRange(-6, 6), d + game.rnd.integerInRange(-4, 4), g);
                null != g && (g.sprite.tint = c)
            }
        },
        CreateTrail: function(a, d, c) {
            particlesCount = 1;
            blendMode = PIXI.blendModes.ADD;
            life = 700;
            Phaser.Device.desktop || (life = Math.ceil(.6 * life));
            for (var b = particlesCount - 1; 0 <= b; b--) {
                getRandomUInt(5);
                getRandomUInt(5);
                var e = this.CreateParticle(a, d, {
                    velX: 0,
                    velY: 0,
                    accX: 0,
                    accY: 0,
                    sprite: "pak",
                    frameName: "dot_1.png",
                    blendMode: blendMode,
                    rotation: 0,
                    scale: {
                        start: 1,
                        end: .3
                    },
                    alpha: {
                        start: .6,
                        end: 0
                    },
                    life: life
                });
                null != e && (e.sprite.tint = c)
            }
        },
        CreateStars: function(a, d, c, b, e) {
            e = e || PIXI.blendModes.NORMAL;
            for (b = (b || 10) - 1; 0 <= b; b--) {
                tmpX = game.rnd.integerInRange(-100, 100) / 20;
                tmpY = game.rnd.integerInRange(-100, 100) / 20;
                var f = {
                        velX: tmpX,
                        velY: tmpY,
                        accX: 0 >= tmpX ? .01 : -.01,
                        accY: 0 >= tmpY ? .01 : -.01,
                        sprite: "pak",
                        frameName: "star_particles.png",
                        blendMode: e,
                        rotation: 4,
                        scale: {
                            start: .7,
                            end: 2
                        },
                        alpha: {
                            start: .7,
                            end: 0
                        },
                        life: 700
                    },
                    f = this.CreateParticle(a + game.rnd.integerInRange(-4, 4), d + game.rnd.integerInRange(-4, 4), f);
                null != f && (f.sprite.tint = c)
            }
        },
        CreateFinalStars: function(a, d, c, b, e) {
            e = PIXI.blendModes.ADD;
            for (b = (b || 10) - 1; 0 <= b; b--) {
                tmpX = game.rnd.integerInRange(-100, 100) / 15;
                tmpY = game.rnd.integerInRange(-100, 100) / 15;
                var f = getRandomUInt(20) / 100,
                    f = {
                        velX: tmpX,
                        velY: tmpY,
                        accX: 0 >= tmpX ? .02 : -.02,
                        accY: 0 >= tmpY ? .02 : -.02,
                        sprite: "pak",
                        frameName: "star_particles.png",
                        blendMode: e,
                        rotation: 4,
                        scale: {
                            start: 1.2 - f,
                            end: 2.3 - f
                        },
                        alpha: {
                            start: .7,
                            end: 0
                        },
                        life: 400
                    },
                    f = this.CreateParticle(a + game.rnd.integerInRange(-10, 10), d + game.rnd.integerInRange(-10, 10), f);
                null != f && (f.sprite.tint = c)
            }
        },
        CreateFallingStars: function(a, d, c) {
            particlesCount = 6;
            for (var b = particlesCount - 1; 0 <= b; b--) {
                var e = game.rnd.integerInRange(-100, 100) / 50,
                    f = game.rnd.integerInRange(-100, 100) / 50;
                this.CreateParticle(a, d, {
                    velX: e,
                    velY: f,
                    accX: 0 >= e ? .01 : -.01,
                    accY: 0 >= f ? .01 : -.01,
                    sprite: "pak",
                    frameName: c,
                    blendMode: PIXI.blendModes.NORMAL,
                    rotation: 0,
                    scale: {
                        start: 1,
                        end: .3
                    },
                    alpha: {
                        start: .7,
                        end: 0
                    },
                    life: 500
                })
            }
        }
    };
    CoinParticles = function(a) {
        this.MAX_PARTICLES = 10;
        this.DURATION = 2 * ScenesTransitions.TRANSITION_LENGTH;
        this.DELAY = ScenesTransitions.TRANSITION_LENGTH / 3;
        this.objCoinParticles = [];
        this._init();
        CoinParticles.instance = this
    };
    CoinParticles.instance = null;
    CoinParticles.prototype = {
        constructor: CoinParticles,
        _init: function(a) {
            for (a = 0; 10 > a; a++) this.objCoinParticles[a] = game.add.sprite(-1E3, -1E3, "pak", "particle_smallest.png"), this.objCoinParticles[a].anchor.set(.5), this.objCoinParticles[a].twnMove = null, this.objCoinParticles[a].twnScale = null
        },
        Reset: function() {
            for (var a = 0; a < this.objCoinParticles.length; a++) this.objCoinParticles[a].visible = !1, null != this.objCoinParticles[a].twnMove && this.objCoinParticles[a].twnMove.stop(), null != this.objCoinParticles[a].twnScale &&
                this.objCoinParticles[a].twnScale.stop(), game.tweens.removeFrom(this.objCoinParticles[a], !0)
        },
        AnimateCoins: function(a, d, c, b, e, f, g, k, h) {
            void 0 === f && (f = null);
            void 0 === g && (g = null);
            void 0 === k && (k = .7);
            void 0 === h && (h = .5);
            ScenesTransitions.transitionStarted();
            e.val = parseInt(e.text);
            var l = e.val + a,
                n = a,
                m = 0,
                q = Math.ceil(a / 10);
            1 > q && (q = 1);
            10 < a && (n = Math.floor(a / q), m = a - n * q);
            CoinParticles.instance.Reset();
            for (var p = 0; p < n; p++) {
                var t = q;
                p == n - 1 && (t += m);
                a -= t;
                this.objCoinParticles[p].position.setTo(d.worldPosition.x, d.worldPosition.y);
                this.objCoinParticles[p].scale.set(k);
                this.objCoinParticles[p].visible = !0;
                MoveSpriteBezier(this.objCoinParticles[p], c.worldPosition.x, c.worldPosition.y, this.DURATION, p * this.DELAY, 1, function() {}, null);
                this.objCoinParticles[p].twnScale = game.add.tween(this.objCoinParticles[p].scale);
                this.objCoinParticles[p].twnScale.to({
                    x: h,
                    y: h
                }, this.DURATION, "Linear", !0, p * this.DELAY);
                this.objCoinParticles[p].twnScale.onStart.add(function() {
                    soundManager.playSound("coin")
                }, {
                    coinParticle: this.objCoinParticles[p],
                    txtObj: b,
                    val: a
                });
                this.objCoinParticles[p].twnScale.onComplete.add(function() {
                    this.txtObj.val += this.inc;
                    this.txtObj.text = "" + this.txtObj.val;
                    this.coinParticle.visible = !1;
                    this.lastOne && (ScenesTransitions.transitionFinished(), this.txtObj.text = "" + this.finalVal, null != f && f(this.params))
                }, {
                    coinParticle: this.objCoinParticles[p],
                    txtObj: e,
                    inc: t,
                    finalVal: l,
                    lastOne: p == n - 1,
                    callback: f,
                    params: g
                })
            }
        }
    };
    TextParticles = function(a) {
        this.MAX_PARTICLES = 3;
        this.objTextParticles = [];
        this._init();
        TextParticles.instance = this
    };
    TextParticles.instance = null;
    TextParticles.prototype = {
        constructor: TextParticles,
        _init: function(a) {
            this.grpTextParticles = game.add.group();
            a = {
                tag: "",
                velX: 0,
                velY: 0,
                accX: 0,
                accY: 0
            };
            for (var d = 0; d < this.MAX_PARTICLES; d++) this.CreateTextParticle(0, 0, "DUMMY", a);
            for (d = 0; d < this.MAX_PARTICLES; d++) this.objTextParticles[d].sprite.visible = !1
        },
        CreateTextParticle: function(a, d, c, b) {
            b.hasOwnProperty("tag") || (b.tag = "");
            b.hasOwnProperty("style") || (b.style = {});
            b.hasOwnProperty("blendMode") || (b.blendMode = PIXI.blendModes.NORMAL);
            b.hasOwnProperty("life") ||
                (b.life = 500 + getRandomUInt(200));
            b.hasOwnProperty("velX") || (b.velX = 0);
            b.hasOwnProperty("velY") || (b.velY = 0);
            b.hasOwnProperty("accX") || (b.accX = 0);
            b.hasOwnProperty("accY") || (b.accY = 0);
            b.hasOwnProperty("rotation") || (b.rotation = 0);
            b.hasOwnProperty("scale") ? (b.scale.hasOwnProperty("start") || (b.scale.start = 1), b.scale.hasOwnProperty("end") || (b.scale.end = b.scale.start)) : b.scale = {
                start: 1,
                end: 1
            };
            b.scale.delta = b.scale.start - b.scale.end;
            b.hasOwnProperty("alpha") ? (b.alpha.hasOwnProperty("start") || (b.alpha.start =
                1), b.alpha.hasOwnProperty("end") || (b.alpha.end = b.alpha.start)) : b.alpha = {
                start: 1,
                end: 1
            };
            b.alpha.delta = b.alpha.start - b.alpha.end;
            for (var e = null, f = 0; f < this.objTextParticles.length && null == e; f++) this.objTextParticles[f].sprite.visible || (e = this.objTextParticles[f], e.sprite.text = c, e.sprite.setStyle(b.style));
            null === e && (e = this.objTextParticles[this.objTextParticles.length] = {}, e.sprite = new Phaser.Text(game, -100, -100, c, b.style), this.grpTextParticles.add(e.sprite), e.sprite.anchor.set(.5));
            game.world.bringToTop(e.sprite);
            e.sprite.visible = !0;
            e.sprite.alpha = b.alpha.start;
            e.sprite.angle = 0;
            e.sprite.x = a;
            e.sprite.y = d;
            e.sprite.scale.set(1);
            e.sprite.tint = 16777215;
            e.sprite.blendMode = b.blendMode;
            e.data = b;
            e.data.lifeInit = b.life;
            0 < b.tag.length && LOG("TILES : " + Particles.instance.GetActiveCount(b.tag));
            return e
        },
        Reset: function() {
            for (var a = 0; a < this.objTextParticles.length; a++) this.objTextParticles[a].sprite.visible = !1
        },
        GetActiveCount: function(a) {
            a = a || null;
            for (var d = 0, c = 0; c < this.objTextParticles.length; c++)(null == a || this.objTextParticles[c].data.tag ==
                a) && this.objTextParticles[c].sprite.visible && 0 < this.objTextParticles[c].data.life && d++;
            return d
        },
        Update: function() {
            for (var a = 0; a < this.objTextParticles.length; a++) this.objTextParticles[a].sprite.visible && (this.objTextParticles[a].data.life -= game.time.elapsedMS, 0 >= this.objTextParticles[a].data.life ? this.objTextParticles[a].sprite.visible = !1 : (this.objTextParticles[a].sprite.alpha = this.objTextParticles[a].data.alpha.start - this.objTextParticles[a].data.alpha.delta + this.objTextParticles[a].data.life / this.objTextParticles[a].data.lifeInit *
                this.objTextParticles[a].data.alpha.delta, this.objTextParticles[a].sprite.scale.set(this.objTextParticles[a].data.scale.start - this.objTextParticles[a].data.scale.delta + this.objTextParticles[a].data.life / this.objTextParticles[a].data.lifeInit * this.objTextParticles[a].data.scale.delta), this.objTextParticles[a].sprite.angle += this.objTextParticles[a].data.rotation, this.objTextParticles[a].sprite.x += this.objTextParticles[a].data.velX, this.objTextParticles[a].sprite.y += this.objTextParticles[a].data.velY,
                this.objTextParticles[a].data.velX += this.objTextParticles[a].data.accX, this.objTextParticles[a].data.velY += this.objTextParticles[a].data.accY))
        },
        Destroy: function() {
            for (var a = 0; a < this.objTextParticles.length; a++) this.objTextParticles[a].sprite.Destroy(), this.objTextParticles[a].sprite = null, this.objTextParticles[a] = null;
            this.objTextParticles = null
        },
        CreateTextParticle1: function(a, d, c, b, e, f) {
            f = f || PIXI.blendModes.NORMAL;
            tmpY = game.rnd.integerInRange(-100, -50) / 50;
            this.CreateTextParticle(a, d, c, {
                velX: 0,
                velY: tmpY,
                accX: 0,
                accY: 0 >= tmpY ? .02 : -.02,
                style: {
                    font: b + "px gameFont",
                    fill: e,
                    stroke: "#FFFFFF",
                    strokeThickness: 4
                },
                blendMode: f,
                rotation: 0,
                scale: {
                    start: 1.2,
                    end: 1
                },
                alpha: {
                    start: .9,
                    end: 0
                },
                life: 1E3
            })
        }
    };
    var Languages = function() {
            if (null != Languages.instance) return Languages.instance;
            Languages.instance = this;
            this.xml = this.gameTextsParsed = null;
            this.gameTextsLists = [];
            var a = game.cache.getText("lang_strings");
            this.gameTextsParsed = (new DOMParser).parseFromString(a, "text/xml");
            for (var a = this.gameTextsParsed.getElementsByTagName("string"), d = 0; d < a.length; d++) {
                null == this.gameTextsLists[a.item(d).getAttribute("id")] && (this.gameTextsLists[a.item(d).getAttribute("id")] = []);
                for (var c = 0; c < LANGUAGES.length; c++) 0 < a.item(d).getElementsByTagName(LANGUAGES[c]).length &&
                    (this.gameTextsLists[a.item(d).getAttribute("id")][LANGUAGES[c]] = a.item(d).getElementsByTagName(LANGUAGES[c])[0].textContent.replace(/\\n/g, "\n"))
            }
        },
        LANGUAGES = "en de es fr it pt nl tr ru".split(" ");
    Languages.instance = null;
    Languages.prototype = {};

    function Str(a) {
        return void 0 == Languages.instance.gameTextsLists[a] || void 0 == Languages.instance.gameTextsLists[a][Languages.instance.language] ? (LOG("Str(" + a + ") MISSING!"), "NAN") : Languages.instance.gameTextsLists[a][Languages.instance.language].replaceAll("\\n", "\n")
    }

    function STR(a) {
        return Str(a).toUpperCase()
    };
    var ORIENTATION_PORTRAIT = 0,
        ORIENTATION_LANDSCAPE = 1,
        GAME_CURRENT_ORIENTATION = ORIENTATION_PORTRAIT,
        MAX_SWIPES = 5,
        game_resolution = {
            x: 480,
            yMin: 650,
            yMax: 1200
        };

    function getMaxGameResolution() {
        return [game_resolution.x, game_resolution.yMax]
    };
    var SOUNDS_ENABLED = !0,
        RUNNING_ON_WP = -1 < navigator.userAgent.indexOf("Windows Phone");
    RUNNING_ON_WP && (SOUNDS_ENABLED = !1);
    var partnerName = "gamedistribution";
    window.partnerName = partnerName;
    var ANIMATION_CUBIC_IO = Phaser.Easing.Cubic.InOut,
        tmp_sprites = [];

    function getRandomUInt(a) {
        return Math.floor(Math.random() * a)
    }

    function getRandomInt(a) {
        return Math.floor(Math.random() * a) * (50 < getRandomUInt(100) ? -1 : 1)
    }

    function getRandomUIntInRange(a, d) {
        return Math.floor(Math.random() * (d - a + 1)) + a
    }

    function getRandomIntInRange(a, d) {
        return getRandomUIntInRange(a, d) * (50 < getRandomUInt(100)) ? -1 : 1
    }
    String.prototype.replaceAll = function(a, d) {
        return this.split(a).join(d)
    };

    function cloneObject(a) {
        if (null == a || "object" != typeof a) return a;
        var d = a.constructor();
        void 0 === d && (d = {});
        for (var c in a) a.hasOwnProperty(c) && (d[c] = a[c]);
        return d
    }

    function isUpperCase(a) {
        return a == a.toUpperCase()
    }

    function isLowerCase(a) {
        return a == a.toLowerCase()
    }

    function LOG(a) {}
    Array.prototype.contains = function(a) {
        for (var d = this.length; d--;)
            if (this[d] === a) return !0;
        return !1
    };

    function shuffleArray(a) {
        for (var d = a.length, c, b; 0 !== d;) b = Math.floor(Math.random() * d), --d, c = a[d], a[d] = a[b], a[b] = c;
        return a
    }

    function getCorrectAnchorX(a, d) {
        return Math.round(a.width * d) / a.width
    }

    function getCorrectAnchorY(a, d) {
        return Math.round(a.height * d) / a.height
    }

    function indentStr(a) {
        for (var d = "", c = 0; c < a; c++) d += "  ";
        return d
    }

    function getAndroidVersion(a) {
        a = (a || navigator.userAgent).toLowerCase();
        return (a = a.match(/android\s([0-9\.]*)/)) ? a[1] : !1
    }

    function updateTextToHeight(a, d, c, b) {
        for (a.style.font = d + 'px "' + c + '"'; a.height > b;) {
            d--;
            var e = a.style;
            e.font = d + 'px "' + c + '"';
            a.setStyle(e)
        }
        return d
    }

    function setTextFontSize(a, d, c) {
        var b = a.style;
        b.font = d + 'px "' + c + '"';
        a.setStyle(b)
    }

    function updateTextToWidth(a, d, c, b) {
        for (a.style.font = d + 'px "' + c + '"'; a.width > b;) {
            d--;
            var e = a.style;
            e.font = d + 'px "' + c + '"';
            a.setStyle(e)
        }
        return d
    }

    function CreateBoardSpr(a, d, c, b, e, f, g, k, h, l) {
        void 0 === g && (g = 0);
        void 0 === k && (k = 0);
        void 0 === h && (h = c);
        void 0 === l && (l = b);
        tmp_sprites.contains(e) || (tmp_sprites[e] = game.make.sprite(-1E4, -1E4, e));
        _width = c;
        _height = b;
        var n, m;
        n = getSpriteFrameWithinAtlas(tmp_sprites[e], f, 0).width;
        m = getSpriteFrameWithinAtlas(tmp_sprites[e], f, 0).height;
        c = Math.floor(c / n + .5) * n;
        b = Math.floor(b / m + .5) * m;
        var q = game.make.bitmapData(c, b);
        q.smoothed = !1;
        var p = c / n - 2,
            t = b / m - 2;
        c = 0 + c;
        q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 0), 0, 0);
        for (var r = 0; r < p; r++) q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 1), 0 + n * (r + 1), 0);
        q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 2), c - n, 0);
        for (var u = 0; u < t; u++)
            for (q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 3), 0, 0 + m * (u + 1)), q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 5), c - n, 0 + m * (u + 1)), r = 0; r < p; r++) q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 4), 0 + n * (r + 1), 0 + m * (u + 1));
        q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 6), 0, 0 + b - m);
        for (r = 0; r < p; r++) q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e],
            f, 7), 0 + n * (r + 1), 0 + b - m);
        q.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 8), c - n, 0 + b - m);
        f = makeSprite(0, 0, "pak", "void.png");
        b = game.rnd.uuid();
        q.generateTexture(b, function(a) {
            LOG("bmpData.generateTexture");
            this.sprite.loadTexture(a);
            this.sprite.scale.set(1);
            this.sprite.width = this.scaledW;
            this.sprite.height = this.scaledH;
            this.sprite.anchor.setTo(this.anchorX, this.anchorY)
        }, {
            sprite: f,
            anchorX: g,
            anchorY: k,
            scaledW: h,
            scaledH: l
        });
        f.x = a;
        f.y = d;
        q.destroy();
        q = null;
        return f
    }

    function CreateDialogSpr(a, d, c, b, e, f, g, k, h, l) {
        var n, m;
        void 0 === g && (g = 0);
        void 0 === k && (k = 0);
        void 0 === h && (h = c);
        void 0 === l && (l = b);
        tmp_sprites.contains(e) || (tmp_sprites[e] = game.make.sprite(-1E4, -1E4, e));
        n = getSpriteFrameWithinAtlas(tmp_sprites[e], f, 0).width;
        m = getSpriteFrameWithinAtlas(tmp_sprites[e], f, 0).height;
        c = game.make.bitmapData(c, b);
        c.smoothed = !1;
        c.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 0), 0, 0);
        c.draw(getSpriteFrameWithinAtlas(tmp_sprites[e], f, 1), 0, 0 + m, n, b - 2 * m);
        c.draw(getSpriteFrameWithinAtlas(tmp_sprites[e],
            f, 2), 0, 0 + b - m);
        f = makeSprite(0, 0, "pak", "void.png");
        b = game.rnd.uuid();
        c.generateTexture(b, function(a) {
            LOG("bmpData.generateTexture");
            this.sprite.loadTexture(a);
            this.sprite.width = this.scaledW;
            this.sprite.height = this.scaledH;
            this.sprite.anchor.setTo(this.anchorX, this.anchorY)
        }, {
            sprite: f,
            anchorX: g,
            anchorY: k,
            scaledW: h,
            scaledH: l
        });
        f.x = a;
        f.y = d;
        c.destroy();
        c = null;
        return f
    }

    function CreateButtonSpr(a, d, c, b, e, f, g, k, h) {
        void 0 === f && (f = 0);
        void 0 === g && (g = 0);
        void 0 === k && (k = 1);
        void 0 === h && (h = 1);
        tmp_sprites.contains(b) || (tmp_sprites[b] = game.make.sprite(-1E4, -1E4, b));
        _width = c;
        var l, n;
        l = game.cache.getFrameByName(b, e + "_0.png").width;
        n = game.cache.getFrameByName(b, e + "_0.png").height;
        var m = game.make.bitmapData(c, n);
        m.smoothed = !1;
        var q = c / l - 2,
            p = 0 + c;
        m.draw(getSpriteFrameWithinAtlas(tmp_sprites[b], e, 0), 0, 0);
        for (var t = 0; t < q; t++) m.draw(getSpriteFrameWithinAtlas(tmp_sprites[b], e, 1), 0 + l *
            (t + 1), 0);
        m.draw(getSpriteFrameWithinAtlas(tmp_sprites[b], e, 2), p - l, 0);
        e = makeSprite(0, 0, "pak", "void.png");
        b = game.rnd.uuid();
        m.generateTexture(b, function(a) {
            this.sprite.loadTexture(a);
            this.sprite.anchor.setTo(this.anchorX, this.anchorY);
            this.sprite.scale.setTo(this.scaleX, this.scaleY)
        }, {
            sprite: e,
            anchorX: f,
            anchorY: g,
            scaleX: k,
            scaleY: h
        });
        e.x = a;
        e.y = d;
        e.width = c * k;
        e.height = n * h;
        m.destroy();
        m = null;
        return e
    }

    function getSpriteFrame(a, d) {
        a.frame = d;
        return a
    }

    function getSpriteFrameWithinAtlas(a, d, c) {
        a.frameName = d + "_" + c + ".png";
        return a
    }

    function makeSprite(a, d, c, b) {
        return c = game.make.sprite(a, d, c, b || 0)
    }

    function addSprite(a, d, c, b) {
        return c = game.add.sprite(a, d, c, b || 0)
    }

    function leadingZero(a, d) {
        for (var c = "" + a; c.length < d;) c = "0" + c;
        return c
    }

    function SetPoingScaleTween(a, d, c, b) {
        var e = 0 > a.scale.x,
            f = 0 > a.scale.y;
        void 0 === d && (d = 150);
        void 0 === c && (c = 0);
        void 0 === b && (b = null);
        var g = a.scale.x;
        game.add.tween(a.scale).to({
            x: g * (e ? -1 : 1),
            y: g * (f ? -1 : 1)
        }, d, Phaser.Easing.Quadratic.Out, !0, c, 0).onStart.add(function() {
            null != this.callbackOnStart && this.callbackOnStart();
            this.obj.scale.setTo(1.3 * g * (e ? -1 : 1), 1.3 * g * (f ? -1 : 1))
        }, {
            obj: a,
            callbackOnStart: b
        })
    }

    function CreateButtonWithText(a, d, c, b, e, f, g, k, h, l) {
        void 0 === g && (g = null);
        void 0 === k && (k = "#FFFFFF");
        void 0 === h && (h = "#000000");
        void 0 === l && (l = 25);
        c = a.create(c, b, "pak", e);
        c.anchor.set(.5);
        d.addChild(c);
        null != g && (a = a.create(0, 0, "pak", g), a.anchor.set(.5), c.addChild(a), c.btnHighlighted = a, a.visible = !1);
        f = game.add.text(1, 0, f, {
            font: l + "px gameFont",
            fill: k
        });
        f.anchor.setTo(.5, .5);
        f.shadowOffsetX = 2;
        f.shadowOffsetY = 2;
        f.shadowColor = h;
        f.shadowFill = h;
        c.addChild(f);
        c.txtCaption = f;
        return c
    }

    function SetTextColor(a, d, c) {
        a.tint = d
    }

    function wiggle(a, d, c) {
        c = a * (2 * Math.PI * c + Math.PI / 2);
        return Math.sin(a * Math.PI * 2 * d) * Math.cos(c)
    }
    var tmpLine = new Phaser.Line(0, 0, 0, 0),
        tmpLineNormal1 = new Phaser.Line(0, 0, 0, 0),
        tmpLineNormal2 = new Phaser.Line(0, 0, 0, 0),
        tmpCircle1 = new Phaser.Circle(0, 0, 10),
        tmpCircle2 = new Phaser.Circle(0, 0, 10);

    function MoveSpriteBezier(a, d, c, b, e, f, g, k) {
        void 0 === g && (g = function() {});
        var h = null;
        tmpLine.start.x = a.position.x;
        tmpLine.start.y = a.position.y;
        tmpLine.end.x = d;
        tmpLine.end.y = c;
        h = tmpLine.coordinatesOnLine(Math.floor(tmpLine.length / 5 + .5));
        LOG("coords.lenght = " + h.length);
        5 > h.length && (h[4] = [], h[4][0] = h[3][0], h[4][1] = h[3][1]);
        tmpLineNormal1.fromAngle(h[1][0], h[1][1], tmpLine.normalAngle, (Math.floor(tmpLine.length / 4) + getRandomInt(10)) * f);
        tmpLineNormal2.fromAngle(h[4][0], h[4][1], tmpLine.normalAngle, (Math.floor(tmpLine.length /
            8) + getRandomInt(20)) * f);
        tmpCircle1.x = tmpLineNormal1.end.x;
        tmpCircle1.y = tmpLineNormal1.end.y;
        tmpCircle2.x = tmpLineNormal2.end.x;
        tmpCircle2.y = tmpLineNormal2.end.y;
        f = [];
        f[0] = {
            x: a.position.x,
            y: a.position.y
        };
        f[1] = {
            x: tmpLineNormal1.end.x,
            y: tmpLineNormal1.end.y
        };
        f[2] = {
            x: tmpLineNormal2.end.x,
            y: tmpLineNormal2.end.y
        };
        f[3] = {
            x: d,
            y: c
        };
        h = game.add.tween(a.position).to({
            x: [f[0].x, f[1].x, f[2].x, f[3].x],
            y: [f[0].y, f[1].y, f[2].y, f[3].y]
        }, b, Phaser.Easing.Quadratic.InOut, !0, e, 0).interpolation(function(a, c) {
            return Phaser.Math.bezierInterpolation(a,
                c)
        });
        a.twnMove = h;
        null != g && h.onComplete.add(g, k)
    }

    function createIngameText(a, d, c, b) {
        a = new Phaser.Text(game, a, d, c, {
            fill: "#FFFFFF",
            font: (b || "25") + "px gameFont"
        });
        a.anchor.x = getCorrectAnchorX(a, .5);
        a.anchor.y = getCorrectAnchorY(a, .5);
        a.shadowOffsetX = 3;
        a.shadowOffsetY = 3;
        a.shadowColor = "#660000";
        return a
    }

    function createResultText(a, d, c, b) {
        a = new Phaser.Text(game, a, d, c, {
            fill: "#ffffff",
            font: (b || "25") + "px gameFont"
        });
        a.anchor.x = getCorrectAnchorX(a, .5);
        a.anchor.y = getCorrectAnchorY(a, .5);
        a.shadowOffsetX = 2;
        a.shadowOffsetY = 2;
        a.shadowColor = "#5b2121";
        a.shadowFill = "#5b2121";
        return a
    }

    function createButtonWithIcon(a, d, c, b, e) {
        a = a.create(d, c, "pak", "button_0.png");
        a.anchor.set(.5);
        a.inputEnabled = !0;
        AddButtonEvents(a, e, ButtonOnInputOver, ButtonOnInputOut);
        b = new Phaser.Sprite(game, 0, -3, "pak", "icons_" + b + ".png");
        b.anchor.set(.5);
        a.addChild(b);
        return a
    }

    function createInstructionsText(a, d, c, b) {
        a = new Phaser.Text(game, a, d, c, {
            fill: "#FFFFFF",
            font: "24px gameFont",
            wordWrap: !0,
            wordWrapWidth: b,
            align: "center"
        });
        a.anchor.x = getCorrectAnchorX(a, .5);
        a.anchor.y = getCorrectAnchorY(a, .5);
        a.shadowOffsetX = 2;
        a.shadowOffsetY = 2;
        a.shadowColor = "#555555";
        a.shadowFill = "#555555";
        return a
    }

    function tweenTint(a, d, c, b) {
        var e = {
            step: 0
        };
        b = game.add.tween(e).to({
            step: 100
        }, b);
        b.onUpdateCallback(function() {
            a.tint = Phaser.Color.interpolateColor(d, c, 100, e.step)
        });
        a.tint = d;
        b.start()
    }

    function tweenBackgroundColor(a, d, c, b, e, f) {
        var g = {
            step: 0
        };
        f = game.add.tween(g).to({
            step: 10
        }, f);
        f.onUpdateCallback(function() {
            a.backgroundColor = Phaser.Color.interpolateColorWithRGB(d, c, b, e, 10, g.step)
        });
        a.backgroundColor = d;
        f.start()
    };
    var IMAGE_FOLDER = "images/";

    function loadSplash(a) {
        a.load.text("lang_strings", "lang.xml");
        a.load.image("inlogic_logo", "" + IMAGE_FOLDER + "inl.png");
        a.load.image("void", "" + IMAGE_FOLDER + "void.png")
    }

    function loadImages(a) {
        a.load.atlas("pak", "" + IMAGE_FOLDER + "pak.png", "" + IMAGE_FOLDER + "pak.json");
        a.load.xml("gamefont_TA_xml", "fnt/gamefont_TA.xml")
    }

    function loadSounds(a) {
        a.load.audio("music_menu", ["audio/music_menu.ogg", "audio/music_menu.mp3"]);
        a.load.audio("menu-click1", ["audio/menu-click1.ogg", "audio/menu-click1.mp3"]);
        a.load.audio("crossed", ["audio/crossed.ogg", "audio/crossed.mp3"]);
        a.load.audio("droptoken", ["audio/droptoken.ogg", "audio/droptoken.mp3"])
    }

    function getPakFrames(a, d) {
        output = [];
        for (var c = 0; c < d.length; c++) output[c] = a + d[c] + ".png";
        return output
    };
    var Splash = function(a) {};

    function enterIncorrectOrientation() {
        if (!game.device.desktop && (LOG("enterIncorrectOrientation()"), showDiv("wrongRotation"), hideDiv("gameCanvas"), null != gameState)) gameState.onGamePause()
    }

    function leaveIncorrectOrientation() {
        if (!game.device.desktop && (LOG("leaveIncorrectOrientation()"), hideDiv("wrongRotation"), showDiv("gameCanvas"), null != gameState)) gameState.onGameResume()
    }
    Splash.prototype = {
        preload: function() {
            game.load.crossOrigin = "Anonymous";
            game.canvas.id = "gameCanvas";
            document.getElementById("gameCanvas").style.position = "fixed";
            this.game.stage.backgroundColor = 0;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = !0;
            game.scale.pageAlignVertically = !0;
            game.scale.refresh();
            window.addEventListener("resize", function() {
                onGameResize()
            });
            onGameResize();
            loadSplash(this.game);
            !game.device.desktop &&
                game.device.chrome && game.device.touch && inIframe() && game.input.mouse.stop()
        },
        create: function() {
            this.game.state.start("PreloadState")
        }
    };
    var savedClientWidth = 0,
        savedClientHeight = 0;

    function onGameResize() {
        LOG("onGameResize()");
        if (null !== game) {
            var a = document.documentElement.clientWidth,
                d = document.documentElement.clientHeight;
            isIOS && a > d && (a = window.innerWidth, d = window.innerHeight);
            GAME_CURRENT_ORIENTATION = ORIENTATION_PORTRAIT;
            resolutionX = game_resolution.x;
            resolutionY = d / a * resolutionX;
            isNaN(resolutionY) && (resolutionY = 0);
            resolutionY < game_resolution.yMin && (resolutionY = game_resolution.yMin);
            resolutionY > game_resolution.yMax && (resolutionY = game_resolution.yMax);
            d > a ? leaveIncorrectOrientation() :
                enterIncorrectOrientation();
            savedClientWidth = a;
            savedClientHeight = d;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = !0;
            game.scale.pageAlignVertically = !0;
            game.scale.refresh();
            game.scale.setGameSize(resolutionX, resolutionY);
            if (null != gameState) gameState.onResolutionChange();
            if (null != preloadState) preloadState.onResolutionChange()
        }
    }

    function inIframe() {
        try {
            return window.self !== window.top
        } catch (a) {
            return !0
        }
    };
    var Preloader = function(a) {},
        loaderPosY, preloadState;
    Preloader.prototype = {
        preload: function() {
            sceneLanguages = null;
            startTime = Date.now();
            this.game.stage.backgroundColor = 0;
            preloadState = this;
            loaderPosY = this.game.world.height / 5 * 4.5;
            imgSplash = this.game.add.sprite(game.width / 2, game.height / 2, "inlogic_logo");
            imgSplash.anchor.x = .5;
            imgSplash.anchor.y = .5;
            imgBtn = this.game.add.sprite(game.width / 2, game.height / 2, "void");
            imgBtn.anchor.set(.5);
            imgBtn.scale.x = game.width / 100 + .2;
            imgBtn.scale.y = game.height / 100 + .2;
            new Languages;
            percentageText = this.game.add.text(this.game.world.centerX,
                this.game.height - 20, "0 %", {
                    font: '35px "Arial Black"',
                    fill: "#FFFFFF"
                });
            percentageText.anchor.set(.5);
            this.game.load.onFileComplete.add(this.fileComplete, this);
            loadImages(this.game);
            SOUNDS_ENABLED && loadSounds(this.game);
            this.loadLanguageSettings();
            game.input.onDown.add(function() {
                game.paused && (game.paused = !1)
            });
        },
        fileComplete: function(a, d, c, b, e) {
            percentageText.text = a + " %";
            100 <= a && this._create()
        },
        _create: function() {
            imgBtn.inputEnabled = !0;
            imgBtn.events.onInputDown.add(this.inputListener,
                this);
            game.add.tween(percentageText).to({
                alpha: 0
            }, 1.4 * ScenesTransitions.TRANSITION_LENGTH, "Linear", !0, 3 * ScenesTransitions.TRANSITION_LENGTH, -1, !0);
            var a = Date.now() - startTime;
            /*2E3 > a ? game.time.events.add(2E3 - a, function() {
                this.startGame()
            }, this) : this.startGame();*/
			this.startGame();
        },
        createMenuText: function(a, d, c) {
            a = new Phaser.Text(game, a, d, c, {
                fill: "#FED87F"
            });
            a.anchor.x = getCorrectAnchorX(a, .5);
            a.anchor.y = getCorrectAnchorY(a, .5);
            a.shadowOffsetX = 3;
            a.shadowOffsetY = 3;
            a.shadowColor = "#660000";
            return a
        },
        loadLanguageSettings: function() {
            language = Languages.instance.language = "en";
            var a = navigator.userLanguage || navigator.language;
            "fr" == a && (Languages.instance.language = "fr", language = a);
            "it" == a && (Languages.instance.language = "it", language = a);
            "de" == a && (Languages.instance.language = "de", language = a);
            "es" == a && (Languages.instance.language = "es", language = a);
            "pt" == a && (Languages.instance.language = "pt", language = a)
        },
        inputListener: function() {
            this.startGame()
        },
        startGame: function() {
            null == sceneLanguages && (imgBtn.inputEnabled = !1, imgBtn.events.onInputDown.dispose(), this.game.world.remove(imgSplash), this.game.world.remove(imgBtn), ScenesTransitions.hideSceneAlpha(percentageText),
                GameData.Load(), sceneLanguages = new SceneLanguages, sceneLanguages.ShowAnimated(), this.loadLanguageSettings(),
            sceneLanguages.OnLanguageSelected())
        },
        onResolutionChange: function() {
            loaderPosY = this.game.world.height / 5 * 4.5;
            imgSplash.reset(game.width / 2, game.height / 2);
            imgBtn.reset(game.width / 2, game.height / 2);
            imgBtn.scale.x = game.width / 100 + .2;
            imgBtn.scale.y = game.height / 100 + .2;
            percentageText.reset(this.game.world.centerX, this.game.height - 20);
            if (void 0 !== sceneLanguages && null != sceneLanguages) sceneLanguages.onResolutionChange()
        }
    };
    var GameData = function() {};
    GameData.BuildTitle = "Tic Tac Toe Master";
    GameData.BuildString = "";
    GameData.BuildDebug = !1;
    GameData.Copyright = "Gradle Code 2019";
    GameData.BuildVersion = "7.0.0";
    GameData.ProfileName = "gradle-tic";
	var gameDifficulty = 1,
        gameSize = 1,
        selectedCol = "stones_0.png";
    GameData.Reset = function() {
        gameDifficulty = 1
    };
    GameData.Load = function() {
        GameData.Reset();
        var a = null;
        try {
            a = JSON.parse(localStorage.getItem(GameData.ProfileName))
        } catch (d) {}
        try {
            gameSize = a.gameSize, gameDifficulty = a.gameDifficulty, selectedCol = a.selectedCol
        } catch (c) {}
        void 0 === gameSize && (gameSize = 1);
        void 0 === gameDifficulty && (gameDifficulty = 1);
        void 0 === selectedCol && (selectedCol = "stones_0.png")
    };
    GameData.Save = function() {
        var a = {};
        a.gameSize = gameSize;
        a.gameDifficulty = gameDifficulty;
        a.selectedCol = selectedCol;
        try {
            localStorage.setItem(GameData.ProfileName, JSON.stringify(a))
        } catch (d) {}
    };
    GAME_SIZE = [, 3, 5, 7];

    function AddButtonEvents(a, d, c, b, e) {
        void 0 === e && (e = null);
        a.inputEnabled = !0;
        a.buttonPressed = !1;
        a.onInputOut = b;
        a.onInputUp = e;
        a.events.onInputDown.add(ButtonOnInputDown, {
            button: a,
            callback: d
        });
        null != c && a.events.onInputOver.add(c, {
            button: a
        });
        null != b && a.events.onInputOut.add(b, {
            button: a
        });
        null != e && a.events.onInputUp.add(e, {
            button: a
        })
    }

    function ButtonOnInputDown() {
        if (!ScenesTransitions.transitionActive) {
            this.button.hasOwnProperty("spriteHighlighted") && (this.button.spriteHighlighted.tint = 16777215);
            this.button.tint = 16777215;
            this.callback();
            if (null != this.button.onInputOut) this.button.onInputOut(this.button);
            this.button.buttonPressed = !0;
            this.button.buttonPressedTime = game.time.totalElapsedSeconds()
        }
    }

    function ButtonOnInputOver(a) {
        a = a || this.button;
        Phaser.Device.desktop && (void 0 === a.overFrame ? (a.hasOwnProperty("spriteHighlighted") && (a.spriteHighlighted.tint = 10066329), a.tint = 10066329) : a.frameName = a.overFrame, a.cachedTint = -1)
    }

    function ButtonOnInputOut(a) {
        a = a || this.button;
        if (Phaser.Device.desktop && (void 0 === a.outFrame ? (a.hasOwnProperty("spriteHighlighted") && (a.spriteHighlighted.tint = 16777215), a.tint = 16777215) : a.frameName = a.outFrame, a.cachedTint = -1, a.buttonPressed && (a.buttonPressed = !1, null != a.onInputUp))) a.onInputUp(a)
    };
    var ScenesTransitions = function() {};
    ScenesTransitions.TRANSITION_LENGTH = 200;
    ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
    ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    ScenesTransitions.transitionActive = !1;
    ScenesTransitions.transitionStarted = function() {
        ScenesTransitions.transitionActive = !0
    };
    ScenesTransitions.transitionFinished = function() {
        ScenesTransitions.transitionActive = !1
    };
    ScenesTransitions.shakeScene = function(a, d, c, b, e, f) {
        void 0 === d && (d = 3);
        void 0 === c && (c = 0);
        void 0 === b && (b = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === e && (e = null);
        void 0 === f && (f = null);
        game.tweens.removeFrom(a, !0);
        var g = game.add.tween(a.position);
        a.position.orgX = a.position.x;
        a.position.orgY = a.position.y;
        a.position.shakeAmount = d;
        g.to({
            x: a.position.x,
            y: a.position.y
        }, b, Phaser.Easing.Cubic.InOut, !0, c);
        g.onUpdateCallback(function(a, c, b) {
            a.target.x = a.target.orgX + getRandomInt(a.target.shakeAmount);
            a.target.y =
                a.target.orgY + getRandomInt(a.target.shakeAmount);
            null != this.callbackOnUpdate && this.callbackOnUpdate(c)
        }, {
            callbackOnUpdate: f
        });
        g.onComplete.add(function() {
            this.scene.position.x = this.scene.position.orgX;
            this.scene.position.y = this.scene.position.orgY;
            null != this.callbackOnComplete && this.callbackOnComplete()
        }, {
            scene: a,
            callbackOnComplete: e
        });
        return g
    };
    ScenesTransitions.showSceneAlpha = function(a, d, c, b, e, f) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH / 2);
        void 0 === e && (e = Phaser.Easing.Linear.In);
        void 0 === b && (b = null);
        void 0 === f && (f = 1);
        game.tweens.removeFrom(a, !1);
        a.visible = !0;
        a.alpha = 0;
        d = game.add.tween(a).to({
            alpha: f
        }, c, e, !1, d);
        d.onComplete.add(ScenesTransitions.onSceneShown, {
            shownScene: a,
            callback: b
        });
        d.start();
        a.showTween = d
    };
    ScenesTransitions.showSceneH = function(a, d, c, b, e) {
        void 0 === b && (b = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === e && (e = null);
        game.tweens.removeFrom(a, !0);
        a.visible = !0;
        a.x = game.width * (d ? -2 : 2);
        a.y = 0;
        showTween = game.add.tween(a).to({
            x: 0
        }, b, ScenesTransitions.TRANSITION_EFFECT_IN, !1);
        showTween.onComplete.add(ScenesTransitions.onSceneShown, {
            shownScene: a,
            callback: e
        });
        showTween.start();
        a.showTween = showTween
    };
    ScenesTransitions.showSceneFromLeft = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        return ScenesTransitions.showSceneH(a, !0, d, c, b)
    };
    ScenesTransitions.showSceneV = function(a, d, c, b, e) {
        void 0 === c && (c = 0);
        void 0 === b && (b = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === e && (e = null);
        game.tweens.removeFrom(a, !0);
        a.visible = !0;
        a.x = 0;
        a.y = game.height * (d ? -2 : 2);
        showTween = game.add.tween(a).to({
            y: 0
        }, b, ScenesTransitions.TRANSITION_EFFECT_IN, !1, c);
        showTween.onComplete.add(ScenesTransitions.onSceneShown, {
            shownScene: a,
            callback: e
        });
        showTween.start();
        a.showTween = showTween
    };
    ScenesTransitions.showSceneFromTop = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        ScenesTransitions.showSceneV(a, !0, d, c, b)
    };
    ScenesTransitions.showSceneFromBottom = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        return ScenesTransitions.showSceneV(a, !1, d, c, b)
    };
    ScenesTransitions.showSceneFromRight = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        return ScenesTransitions.showSceneH(a, !1, d, c, b)
    };
    ScenesTransitions.hideSceneAlpha = function(a, d, c, b, e) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH / 2);
        void 0 === e && (e = Phaser.Easing.Linear.In);
        void 0 === b && (b = null);
        game.tweens.removeFrom(a, !0);
        var f = game.add.tween(a);
        f.to({
            alpha: 0
        }, c, e, !1, d);
        f.onComplete.add(ScenesTransitions.onSceneHidden, {
            hiddenScene: a,
            callback: b
        });
        f.start();
        return a.hideTween = f
    };
    ScenesTransitions.hideSceneH = function(a, d, c, b, e) {
        void 0 === c && (c = 0);
        void 0 === e && (e = null);
        game.tweens.removeFrom(a, !0);
        b = game.add.tween(a);
        b.to({
            x: game.width * (d ? -2 : 2)
        }, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.TRANSITION_EFFECT_OUT, c);
        b.onComplete.add(ScenesTransitions.onSceneHidden, {
            hiddenScene: a,
            callback: e
        });
        b.start();
        return a.hideTween = b
    };
    ScenesTransitions.hideSceneToLeft = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        return ScenesTransitions.hideSceneH(a, !0, d, c, b)
    };
    ScenesTransitions.hideSceneToRight = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        return ScenesTransitions.hideSceneH(a, !1, d, c, b)
    };
    ScenesTransitions.hideSceneV = function(a, d, c, b, e) {
        void 0 === e && (e = null);
        game.tweens.removeFrom(a, !0);
        c = game.add.tween(a);
        c.to({
            y: game.height * (d ? -2 : 2)
        }, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.TRANSITION_EFFECT_OUT);
        c.onComplete.add(ScenesTransitions.onSceneHidden, {
            hiddenScene: a,
            callback: e
        });
        c.start();
        return a.hideTween = c
    };
    ScenesTransitions.hideSceneToTop = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        return ScenesTransitions.hideSceneV(a, !0, d, c, b)
    };
    ScenesTransitions.hideSceneToBottom = function(a, d, c, b) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH);
        void 0 === b && (b = null);
        return ScenesTransitions.hideSceneV(a, !1, d, c, b)
    };
    ScenesTransitions.onSceneHidden = function() {
        this.hiddenScene.visible = !1;
        null != this.callback && this.callback()
    };
    ScenesTransitions.onSceneShown = function() {
        null != this.callback && this.callback()
    };
    ScenesTransitions.showSceneScale = function(a, d, c, b, e, f) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH / 2);
        void 0 === b && (b = null);
        void 0 === e && (e = ScenesTransitions.TRANSITION_EFFECT_IN);
        void 0 === f && (f = 1);
        a.scale.set(0);
        a.visible = !0;
        d = game.add.tween(a.scale).to({
            x: f,
            y: f
        }, c, e, !1, d);
        d.onComplete.add(ScenesTransitions.onSceneShown, {
            shownScene: a,
            callback: b
        });
        d.start();
        a.showTween = d
    };
    ScenesTransitions.hideSceneScale = function(a, d, c, b, e) {
        void 0 === d && (d = 0);
        void 0 === c && (c = ScenesTransitions.TRANSITION_LENGTH / 2);
        void 0 === b && (b = null);
        void 0 === e && (e = ScenesTransitions.TRANSITION_EFFECT_IN);
        a.visible = !0;
        d = game.add.tween(a.scale).to({
            x: 0,
            y: 0
        }, c, e, !1, d);
        d.onComplete.add(ScenesTransitions.onSceneHidden, {
            hiddenScene: a,
            callback: b
        });
        d.start();
        a.hideTween = d
    };
    var SceneBackground = function() {
        SceneBackground.instance = this;
        this.create()
    };
    SceneBackground.instance = null;
    SceneBackground.prototype = {
        create: function() {
            grpSceneBackgroundCenter = game.add.group();
            grpSceneBackgroundCenter.name = "grpSceneBackgroundCenter";
            imgBackgroundBGAnchor = grpSceneBackgroundCenter.create(game.width >> 1, 0, "pak", "bg.png");
            imgBackgroundBGAnchor.width = 1.1 * game.width;
            imgBackgroundBGAnchor.height = game.height;
            imgBackgroundBGAnchor.anchor.setTo(.5, 0);
            imgBackgroundLogo = game.add.sprite(game.width >> 1, .3 * (game.height >> 1), "pak", "logo.png");
            imgBackgroundLogo.name = "imgBackgroundLogo";
            imgBackgroundLogo.anchor.set(.5);
            grpSceneBackgroundCenter.addChild(imgBackgroundLogo);
            imgBackgroundDecor = grpSceneBackgroundCenter.create(game.width / 2, game.height - 50, "pak", "decor.png");
            imgBackgroundDecor.anchor.setTo(.5, 1);
            grpSceneBackgroundCenter.visible = !1;
            this.onResolutionChange()
        },
        reloadSkin: function(a) {
            imgBackgroundBGAnchor.loadTexture(a, "bg.png")
        },
        onResolutionChange: function() {
            LOG("[" + game.width + ", " + game.height + "]");
            imgBackgroundBGAnchor.width = 1.1 * game.width;
            imgBackgroundBGAnchor.height = game.height;
            imgBackgroundLogo.height =
                .26 * game.height;
            imgBackgroundLogo.scale.x = imgBackgroundLogo.scale.y;
            imgBackgroundLogo.width > .9 * game.width && (imgBackgroundLogo.width = .9 * game.width, imgBackgroundLogo.scale.y = imgBackgroundLogo.scale.x);
            imgBackgroundDecor.height = .15 * game.height;
            imgBackgroundDecor.scale.x = imgBackgroundDecor.scale.y;
            imgBackgroundLogo.position.setTo(game.width >> 1, .22 * game.height);
            imgBackgroundDecor.position.setTo(game.width / 2, .98 * game.height)
        },
        update: function() {},
        ShowAnimated: function() {
            soundManager.playSound("menu-click1");
            ScenesTransitions.transitionStarted();
            gameRunning = !1;
            ScenesTransitions.showSceneAlpha(grpSceneBackgroundCenter, 0, 4 * ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In
        }
    };
    var SceneMenu = function() {
        SceneMenu.instance = this;
        this.create()
    };
    SceneMenu.instance = null;
    SceneMenu.prototype = {
        create: function() {
            grpSceneMenu = game.add.group();
            grpSceneMenu.name = "grpSceneMenu";
            btnMenuSize = SceneMenu.instance.createButtonWithText("pak", "bt_long.png", GAME_SIZE[gameSize] + " x " + GAME_SIZE[gameSize], function() {
                gameSize++;
                2 < gameSize && (gameSize = 1);
                SceneGame.instance.DestroyBoard();
                btnMenuSize.caption.text = GAME_SIZE[gameSize] + " x " + GAME_SIZE[gameSize];
                GameData.Save();
                gradle.event('btnMenuSize');
            }, "ARIAL", 40);
            btnMenuSize.caption.y += 2;
            btnMenuSize.position.setTo(game.width /
                2, game.height / 2 + 40);
            btnMenuSize.scale.set(1);
            grpSceneMenu.addChild(btnMenuSize);
            btnMenuPlayAI = this.createButtonWith3Icons("pak", "bt_long.png", "icons_0.png", "icons_16.png", "icons_1.png", this.OnPressedPlayAI);
            grpSceneMenu.add(btnMenuPlayAI);
            btnMenuPlayVS = this.createButtonWith3Icons("pak", "bt_long.png", "icons_0.png", "icons_16.png", "icons_0.png", this.OnPressedPlayVS);
            grpSceneMenu.add(btnMenuPlayVS);
            SOUNDS_ENABLED && (btnMenuMusic = this.createButtonWithIcon("pak", "bt_big.png", soundManager.musicPlaying ? "icons_2.png" :
                "icons_3.png",
                function() {
                    soundManager.toggleMusic("music_menu");
                    soundManager.toggleSounds();
                    btnMenuMusic.icon.frameName = soundManager.musicPlaying ? "icons_2.png" : "icons_3.png";
                    btnPauseMusic.icon.frameName = soundManager.musicPlaying ? "icons_2.png" : "icons_3.png";
                    gradle.event('btnMenuMusic');
                }), btnMenuMusic.anchor.set(.5));
            btnMenuInstructions = this.createButtonWithIcon("pak", "bt_big.png", "icons_15.png", this.OnPressedMenuInstructions);
            btnMenuInstructions.anchor.set(.5);
            grpSceneMenu.visible = !1;
            this.onResolutionChange()
        },
        createButtonWithText: function(a, d, c, b, e, f, g) {
            void 0 === e && (e = GAME_FONT);
            void 0 === f && (f = 30);
            void 0 === g && (g = "#FFFFFF");
            a = game.add.sprite(0, 0, a, d);
            a.anchor.set(.5);
            a.scale.set(1);
            AddButtonEvents(a, b, ButtonOnInputOver, ButtonOnInputOut);
            c = new Phaser.Text(game, 0, 0, c, {
                fill: g,
                font: f + "px " + e,
                align: "center"
            });
            c.anchor.x = getCorrectAnchorX(c, .5);
            c.anchor.y = getCorrectAnchorY(c, .5);
            a.addChild(c);
            a.caption = c;
            updateTextToWidth(c, f, e, .75 * a.width);
            return a
        },
        createButtonWithIcon: function(a,
            d, c, b) {
            a = game.add.sprite(0, 0, a, d);
            a.anchor.set(.5);
            a.scale.set(1);
            c = game.add.sprite(0, 0, "pak", c);
            c.anchor.set(.5);
            c.scale.set(1);
            a.addChild(c);
            a.icon = c;
            AddButtonEvents(a, b, ButtonOnInputOver, ButtonOnInputOut);
            return a
        },
        createButtonWith2Icons: function(a, d, c, b, e) {
            a = game.add.sprite(0, 0, a, d);
            a.anchor.set(.5);
            a.scale.set(1);
            c = game.add.sprite(.1 * -a.width, 0, "pak", c);
            c.anchor.set(.5);
            c.scale.set(1);
            a.addChild(c);
            a.icon1 = c;
            b = game.add.sprite(.1 * a.width, 0, "pak", b);
            b.anchor.set(.5);
            b.scale.set(1);
            a.addChild(b);
            a.icon2 = b;
            AddButtonEvents(a, e, ButtonOnInputOver, ButtonOnInputOut);
            return a
        },
        createButtonWith3Icons: function(a, d, c, b, e, f) {
            a = game.add.sprite(0, 0, a, d);
            a.anchor.set(.5);
            a.scale.set(1);
            c = game.add.sprite(.22 * -a.width, 0, "pak", c);
            c.anchor.set(.5);
            c.scale.set(1);
            a.addChild(c);
            a.icon1 = c;
            b = game.add.sprite(0, 0, "pak", b);
            b.anchor.set(.5);
            b.scale.set(1);
            a.addChild(b);
            a.icon2 = b;
            e = game.add.sprite(.22 * a.width, 0, "pak", e);
            e.anchor.set(.5);
            e.scale.set(1);
            a.addChild(e);
            a.icon3 = e;
            AddButtonEvents(a, f, ButtonOnInputOver, ButtonOnInputOut);
            return a
        },
        createButtonWithTextAndIcon: function(a, d, c, b, e, f, g, k) {
            void 0 === f && (f = GAME_FONT);
            void 0 === g && (g = 30);
            void 0 === k && (k = "#FFFFFF");
            a = game.add.sprite(0, 0, a, d);
            a.anchor.set(.5);
            a.scale.set(1);
            c = new Phaser.Text(game, a.width * (.2 + .4 - .5), 0, c, {
                fill: k,
                font: g + "px " + f,
                align: "center"
            });
            c.anchor.x = getCorrectAnchorX(c, .5);
            c.anchor.y = getCorrectAnchorY(c, .5);
            a.addChild(c);
            a.caption = c;
            updateTextToWidth(c, g, f, .45 * a.width);
            b = game.add.sprite(-.3 * a.width, -5, "pak", b);
            b.anchor.set(.5);
            b.scale.set(1);
            a.addChild(b);
            a.icon = b;
            AddButtonEvents(a, e, ButtonOnInputOver, ButtonOnInputOut);
            return a
        },
        createScalableLabelWithText: function(a, d, c, b, e) {
            void 0 === c && (c = GAME_FONT);
            void 0 === b && (b = 30);
            void 0 === e && (e = "#FFFFFF");
            var f = game.add.sprite(0, 0, "pak", "void.png");
            f.anchor.set(.5);
            f.scale.set(1);
            var g = game.add.sprite(0, 0, a, "tab1.png");
            g.anchor.setTo(0, .5);
            g.scale.set(1);
            f.addChild(g);
            var k = game.add.sprite(g.left, 0, a, "tab0.png");
            k.anchor.setTo(1, .5);
            k.scale.set(1);
            f.addChild(k);
            a = game.add.sprite(g.right, 0, a, "tab2.png");
            a.anchor.setTo(0,
                .5);
            a.scale.set(1);
            f.addChild(a);
            f.centerPart = g;
            f.leftPart = k;
            f.rightPart = a;
            c = new Phaser.Text(game, 0, 0, "TEST123", {
                fill: e,
                font: b + "px " + c,
                align: "center"
            });
            c.anchor.x = getCorrectAnchorX(c, .5);
            c.anchor.y = getCorrectAnchorY(c, .5);
            f.addChild(c);
            f.caption = c;
            f.setWidth = function(a) {
                a < this.leftPart.width + this.rightPart.width && (a = this.leftPart.width + this.rightPart.width);
                this.centerPart.width = a - this.leftPart.width - this.rightPart.width;
                0 != this.centerPart.width % 2 && this.centerPart.width++;
                this.centerPart.x = -this.centerPart.width /
                    2;
                this.leftPart.x = this.centerPart.x;
                this.rightPart.x = this.centerPart.x + this.centerPart.width
            };
            f.setText = function(a) {
                this.caption.text = a;
                updateTextToWidth(this.caption, 22, "Arial", .7 * game.width);
                this.setWidth(this.caption.width + 86)
            };
            f.setText(d);
            return f
        },
        onResolutionChange: function() {
            var a = .44 * game.height;
            btnMenuSize.position.setTo(game.width >> 1, a);
            a += 80;
            btnMenuPlayAI.position.setTo(game.width >> 1, a);
            a += 80;
            btnMenuPlayVS.position.setTo(game.width >> 1, a);
            var a = a + 80,
                d = 0;
            SOUNDS_ENABLED && (btnMenuMusic.position.setTo((game.width >>
                1) - 85, a), d = 85);
            btnMenuInstructions.position.setTo((game.width >> 1) + d, a)
        },
        updateTexts: function() {
            SceneMenu.instance.UpdateLangIcon(btnMenuLang)
        },
        UpdateLangIcon: function(a) {
            switch (Languages.instance.language) {
                case "en":
                    a.frameName = "flag1.png";
                    break;
                case "fr":
                    a.frameName = "flag2.png";
                    break;
                case "pt":
                    a.frameName = "flag3.png";
                    break;
                case "de":
                    a.frameName = "flag4.png";
                    break;
                case "it":
                    a.frameName = "flag5.png";
                    break;
                case "es":
                    a.frameName = "flag6.png"
            }
        },
        OnPressedPlayAI: function() {
            soundManager.playSound("menu-click1");
            gameMode = COMPUTER_AI;
            SceneMenu.instance.HideAnimated();
            SceneGameSetup.instance.ShowAnimated();
            gradle.event('btnPlayAI');
        },
        OnPressedPlayVS: function() {
            soundManager.playSound("menu-click1");
            gameMode = HUMAN_PLAYER;
            SceneMenu.instance.HideAnimated();
            SceneGame.instance.NewGame();
            SceneGame.instance.ShowAnimated();
            ScenesTransitions.hideSceneAlpha(imgBackgroundLogo);
			gradle.event('btnPlayVS');
        },
        OnPressedPauseLang: function() {
            soundManager.playSound("menu-click1");
            SceneToReturnFromLanguage = SceneMenu.instance;
            SceneLogo.instance.HideAnimated();
            SceneMenu.instance.HideAnimated();
            SceneLanguages.instance.ShowAnimated();
			gradle.event('btnPauseLang');
        },
        OnPressedMenuInstructions: function() {
            soundManager.playSound("menu-click1");
            SceneToReturnFromInstructions = SceneMenu.instance;
            SceneMenu.instance.HideAnimated();
            SceneInstructions.instance.ShowAnimated();
            gradle.event('btnMenuInstructions');
        },
        OnPressedMenuShop: function() {
            soundManager.playSound("menu-click1");
            SceneMenu.instance.HideAnimated();
            SceneShop.instance.ShowAnimated();
			gradle.event('btnMenuShop');
        },
        ShowAnimated: function(a) {
            SceneMenu.instance.onResolutionChange();
            void 0 === a && (a = 0);
            soundManager.playMusic("music_menu");
            soundManager.playSound("menu-click1");
            ScenesTransitions.transitionStarted();
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
            ScenesTransitions.showSceneAlpha(grpSceneMenu, a + 100, 200);
            ScenesTransitions.showSceneScale(btnMenuSize, a + 200, 200, null, Phaser.Easing.Back.Out);
            ScenesTransitions.showSceneScale(btnMenuPlayAI, a + 300, 200, null, Phaser.Easing.Back.Out);
            ScenesTransitions.showSceneScale(btnMenuPlayVS,
                a + 400, 200, null, Phaser.Easing.Back.Out);
            SOUNDS_ENABLED && ScenesTransitions.showSceneScale(btnMenuMusic, a + 500, 200, null, Phaser.Easing.Back.Out, btnMenuMusic.SCALE);
            ScenesTransitions.showSceneScale(btnMenuInstructions, a + 500, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Back.Out, btnMenuInstructions.SCALE);
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In
        },
        HideAnimated: function() {
            ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
            ScenesTransitions.hideSceneScale(btnMenuInstructions,
                0, 100, null, Phaser.Easing.Back.In);
            SOUNDS_ENABLED && ScenesTransitions.hideSceneScale(btnMenuMusic, 50, 100, null, Phaser.Easing.Back.In);
            ScenesTransitions.hideSceneScale(btnMenuSize, 100, 100, null, Phaser.Easing.Back.In);
            ScenesTransitions.hideSceneScale(btnMenuPlayVS, 150, 100, null, Phaser.Easing.Back.In);
            ScenesTransitions.hideSceneScale(btnMenuPlayAI, 200, 100, null, Phaser.Easing.Back.In);
            ScenesTransitions.hideSceneAlpha(grpSceneMenu, 250, 100, null, Phaser.Easing.Linear.Out);
            ScenesTransitions.TRANSITION_EFFECT_OUT =
                Phaser.Easing.Linear.Out
        }
    };
    var SceneGameSetup = function() {
        SceneGameSetup.instance = this;
        this.create()
    };
    SceneGameSetup.instance = null;
    SceneGameSetup.prototype = {
        create: function() {
            grpSceneGameSetup = game.add.group();
            grpSceneGameSetup.name = "grpSceneGameSetup";
            btnGameSetupPlay = SceneMenu.instance.createButtonWithIcon("pak", "bt_long.png", "icons_9.png", function() {
                SceneGameSetup.instance.HideAnimated();
                SceneMenu.instance.HideAnimated();
                ScenesTransitions.hideSceneAlpha(imgBackgroundLogo);
                SceneGame.instance.NewGame();
                SceneGame.instance.ShowAnimated()
            });
            btnGameSetupPlay.position.setTo(game.width / 2, game.height / 2 - 60);
            btnGameSetupPlay.scale.set(1);
            grpSceneGameSetup.addChild(btnGameSetupPlay);
            btnGameSetupDifficulty = SceneMenu.instance.createButtonWithTextAndIcon("pak", "bt_long.png", 1 == gameDifficulty ? STR("NORMAL") : STR("HARD"), "icons_8.png", function() {
                gameDifficulty++;
                2 < gameDifficulty && (gameDifficulty = 1);
                btnGameSetupDifficulty.caption.text = 1 == gameDifficulty ? STR("NORMAL") : STR("HARD");
                GameData.Save();
                gradle.event('btnSetupDifficulty');
            }, "Arial", 27);
            btnGameSetupDifficulty.icon.y += 2;
            btnGameSetupDifficulty.caption.y +=
                2;
            btnGameSetupDifficulty.icon.x += 15;
            btnGameSetupDifficulty.caption.x += 5;
            btnGameSetupDifficulty.position.setTo(game.width / 2, game.height / 2 + 120);
            btnGameSetupDifficulty.scale.set(1);
            grpSceneGameSetup.addChild(btnGameSetupDifficulty);
            btnGameSetupStonesRed = SceneMenu.instance.createButtonWithIcon("pak", "bt_big.png", "stones_0.png", function() {
                selectedCol = "stones_0.png";
                btnGameSetupStonesYellow.alpha = .5;
                btnGameSetupStonesRed.alpha = 1;
                GameData.Save();
                gradle.event('btnSetupStonesRed');
            });
            btnGameSetupStonesRed.anchor.set(.5);
            btnGameSetupStonesRed.icon.scale.set(.5);
            grpSceneGameSetup.addChild(btnGameSetupStonesRed);
            btnGameSetupStonesYellow = SceneMenu.instance.createButtonWithIcon("pak", "bt_big.png", "stones_1.png", function() {
                selectedCol = "stones_1.png";
                btnGameSetupStonesYellow.alpha = 1;
                btnGameSetupStonesRed.alpha = .5;
                GameData.Save();
                gradle.event('btnSetupStonesYellow');
            });
            btnGameSetupStonesYellow.alpha = .5;
            btnGameSetupStonesYellow.icon.scale.set(.5);
            btnGameSetupStonesYellow.anchor.set(.5);
            grpSceneGameSetup.addChild(btnGameSetupStonesYellow);
            "stones_1.png" == selectedCol && (btnGameSetupStonesYellow.alpha = 1, btnGameSetupStonesRed.alpha = .5);
            btnGameSetupBack = SceneMenu.instance.createButtonWithIcon("pak", "bt_small.png", "icons_14.png", function() {
                SceneGameSetup.instance.HideAnimated();
                SceneMenu.instance.ShowAnimated()
            });
            btnGameSetupBack.anchor.set(.5);
            grpSceneGameSetup.addChild(btnGameSetupBack);
            grpSceneGameSetup.visible = !1;
            this.onResolutionChange()
        },
        reloadSkin: function(a) {
            imgCSGBg.loadTexture(a,
                imgCSGBg.frameName);
            btnGameSetupPlay.loadTexture(a, btnGameSetupPlay.frameName);
            btnGameSetupDifficulty.loadTexture(a, btnGameSetupDifficulty.frameName)
        },
        onResolutionChange: function() {
            var a = .44 * game.height;
            btnGameSetupPlay.position.setTo(game.width >> 1, a);
            a += 100;
            btnGameSetupDifficulty.position.setTo(game.width >> 1, a);
            a += 100;
            btnGameSetupStonesRed.position.setTo((game.width >> 1) - 85, a);
            btnGameSetupStonesYellow.position.setTo((game.width >> 1) + 85, a);
            btnGameSetupBack.position.setTo(40, game.height - 40)
        },
        updateTexts: function() {},
        ShowAnimated: function(a) {
            void 0 === a && (a = 0);
            btnGameSetupDifficulty.caption.text = 1 == gameDifficulty ? STR("NORMAL") : STR("HARD");
            this.onResolutionChange();
            soundManager.playSound("menu-click1");
            ScenesTransitions.transitionStarted();
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
            ScenesTransitions.showSceneAlpha(grpSceneGameSetup, a + 100, 200);
            ScenesTransitions.showSceneScale(btnGameSetupPlay, a + 200, 200, null, Phaser.Easing.Back.Out);
            ScenesTransitions.showSceneScale(btnGameSetupDifficulty, a + 300,
                200, null, Phaser.Easing.Back.Out);
            SOUNDS_ENABLED && ScenesTransitions.showSceneScale(btnGameSetupStonesRed, a + 400, 200, null, Phaser.Easing.Back.Out, btnMenuMusic.SCALE);
            ScenesTransitions.showSceneScale(btnGameSetupStonesYellow, a + 500, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Back.Out, btnMenuInstructions.SCALE);
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In
        },
        HideAnimated: function() {
            ScenesTransitions.hideSceneAlpha(grpSceneGameSetup)
        }
    };
    var gameRunning = !1,
        gamePaused = !1,
        HUMAN_PLAYER = 1,
        COMPUTER_AI = 2,
        WINNING_SCORE = 1E5,
        SceneGame = function() {
            SceneGame.instance = this;
            this.create()
        };
    SceneGame.instance = null;
    SceneGame.prototype = {
        create: function() {
            grpSceneGame = game.add.group();
            grpSceneGame.name = "grpSceneGame";
            imgResultWin = grpSceneGame.create(game.width / 2, .3 * -game.height, "pak", "win.png");
            imgResultWin.anchor.set(.5);
            imgResultWinStone = grpSceneGame.create(0, -35, "pak", "stones_0.png");
            imgResultWinStone.anchor.set(.5);
            imgResultWinStone.scale.set(.9);
            imgResultWin.addChild(imgResultWinStone);
            imgGameBGAnchor = grpSceneGame.create(game.width / 2, game.height / 2, "pak", "game_bg.png");
            imgGameBGAnchor.anchor.set(.5);
            imgGameBGAnchor.offsY =
                0;
            gameCells = btnGamePause = sprCrossLine = null;
            this.CreateBoard();
            imgGamePlayer1Bg = grpSceneGame.create(120, 100, "pak", "game_l.png");
            imgGamePlayer1Bg.anchor.set(.5);
            imgGamePlayer1Col = grpSceneGame.create(-56, -8, "pak", "stones_0.png");
            imgGamePlayer1Col.anchor.set(.5);
            imgGamePlayer1Col.scale.set(.6);
            imgGamePlayer1Bg.addChild(imgGamePlayer1Col);
            imgGamePlayer1Fig = grpSceneGame.create(24, 0, "pak", "icons_0.png");
            imgGamePlayer1Fig.anchor.set(.5);
            imgGamePlayer1Bg.addChild(imgGamePlayer1Fig);
            imgGamePlayer2Bg = grpSceneGame.create(game.width -
                120, 100, "pak", "game_r.png");
            imgGamePlayer2Bg.anchor.set(.5);
            imgGamePlayer2Col = grpSceneGame.create(56, -8, "pak", "stones_1.png");
            imgGamePlayer2Col.anchor.set(.5);
            imgGamePlayer2Col.scale.set(.6);
            imgGamePlayer2Bg.addChild(imgGamePlayer2Col);
            imgGamePlayer2Fig = grpSceneGame.create(-24, 0, "pak", "icons_0.png");
            imgGamePlayer2Fig.anchor.set(.5);
            imgGamePlayer2Bg.addChild(imgGamePlayer2Fig);
            imgGameTimeBg = grpSceneGame.create(game.width / 2, 90, "pak", "game_c.png");
            imgGameTimeBg.anchor.set(.5);
            txtGameTimeVal = game.add.text(0,
                17, "00", {
                    font: "22px Arial",
                    fill: "#FFFFFF",
                    align: "center"
                });
            txtGameTimeVal.anchor.x = .5;
            txtGameTimeVal.anchor.y = .5;
            imgGameTimeBg.addChild(txtGameTimeVal);
            btnGameMainMenu = SceneMenu.instance.createButtonWithIcon("pak", "bt_big.png", "icons_10.png", function() {
                ScenesTransitions.showSceneAlpha(imgBackgroundLogo);
                ScenesTransitions.showSceneAlpha(imgBackgroundDecor);
                ScenesTransitions.showSceneAlpha(btnGamePause);
                imgGameBGAnchor.offsY = 0;
                SceneGame.instance.HideAnimated();
                SceneMenu.instance.ShowAnimated();
                "undefined" !==
                gradle.event('btnMainMenu');
            });
            btnGameMainMenu.anchor.set(.5);
            grpSceneGame.addChild(btnGameMainMenu);
            btnGameRestart = SceneMenu.instance.createButtonWithIcon("pak", "bt_big.png", "icons_12.png", function() {
                ScenesTransitions.transitionStarted();
                SceneGame.instance.RestartRound();
                ScenesTransitions.showSceneAlpha(imgBackgroundDecor);
                ScenesTransitions.showSceneAlpha(btnGamePause);
                tween = game.add.tween(imgGameBGAnchor);
                tween.to({
                    offsY: 0
                }, 150, Phaser.Easing.Linear.Out, !0, 0);
                tween.onUpdateCallback(function(a,
                    d, c) {
                    SceneGame.instance.onResolutionChange()
                });
                tween.onComplete.add(function() {
                    ScenesTransitions.transitionFinished();
                    SceneGame.instance.onResolutionChange()
                }, this)
            });
            btnGameRestart.anchor.set(.5);
            grpSceneGame.addChild(btnGameRestart);
            player1Col = "stones_0.png";
            player2Col = "stones_1.png";
            gameMode = COMPUTER_AI;
            this.onResolutionChange();
            aiPlayer = new AIPlayer;
            gameRunning = grpSceneGame.visible = !1
        },
        DestroyBoard: function() {
            if (null != gameCells) {
                for (var a = 0; a < gameCells.length; a++)
                    for (; 0 < gameCells[a].length;) gameCells[a][0].destroy(),
                        gameCells[a].splice(0, 1);
                gameCells = null
            }
        },
        CreateBoard: function() {
            if (null == gameCells) {
                null != sprCrossLine && sprCrossLine.destroy();
                null != btnGamePause && btnGamePause.destroy();
                gameCells = [];
                for (var a = (game.width - 30) / GAME_SIZE[gameSize], d = a - .9 * a, a = Math.floor(a - d), d = Math.floor(d), c = (GAME_SIZE[gameSize] * a + 3 * (GAME_SIZE[gameSize] - 1)) / 2, b = -c + a / 2 - 15, e = 0; e < GAME_SIZE[gameSize]; e++) {
                    var f = -c + a / 2 - 15;
                    gameCells[e] = [];
                    for (var g = 0; g < GAME_SIZE[gameSize]; g++) gameCells[e][g] = grpSceneGame.create(b, f, "pak", "tile.png"), gameCells[e][g].anchor.set(.5),
                        gameCells[e][g].width = a, gameCells[e][g].height = a, gameCells[e][g].orgY = f, gameCells[e][g].stone = grpSceneGame.create(0, 0, "pak", "stones_2.png"), gameCells[e][g].stone.anchor.set(.5), gameCells[e][g].stone.width = 1.9 * a, gameCells[e][g].stone.height = 1.9 * a, gameCells[e][g].stone.visible = !1, gameCells[e][g].addChild(gameCells[e][g].stone), gameCells[e][g].shine = grpSceneGame.create(0, 0, "pak", "stones_2.png"), gameCells[e][g].shine.blendMode = Phaser.PIXI.blendModes.ADD, gameCells[e][g].shine.alpha = .5, gameCells[e][g].shine.visible = !1, game.add.tween(gameCells[e][g].shine).to({
                            alpha: 0
                        }, 150, Phaser.Easing.Linear.In, !0, 0, -1, !0), gameCells[e][g].addChild(gameCells[e][g].shine), gameCells[e][g].X = e, gameCells[e][g].Y = g, AddButtonEvents(gameCells[e][g], this.OnPressedCell, null, null), imgGameBGAnchor.addChild(gameCells[e][g]), f += a + d;
                    b += a + d
                }
                sprCrossLine = grpSceneGame.create(-1E3, -1E3, "pak", "blank.png");
                sprCrossLine.anchor.setTo(.5, 1);
                sprCrossLine.width = 5;
                sprCrossLine.height = 5;
                sprCrossLine.tint = 16711680;
                imgGameBGAnchor.addChild(sprCrossLine);
                sprCrossLine.bringToTop();
                btnGamePause = SceneMenu.instance.createButtonWithIcon("pak", "bt_small.png", "icons_11.png", function() {
                    SceneGame.instance.HideAnimated();
                    ScenePause.instance.ShowAnimated();
                    gradle.event('btnPause');
                });
                btnGamePause.anchor.set(.5);
                grpSceneGame.addChild(btnGamePause);
                btnGamePause.bringToTop()
            }
        },
        GetBoardMatrix: function() {
            for (var a = [], d = 0; d < gameCells[0].length; d++) {
                a[d] = [];
                for (var c = 0; c < gameCells.length; c++) a[d][c] = 0, gameCells[c][d].stone.visible ?
                    gameCells[c][d].stone.frameName == player1Col ? a[d][c] = 1 : gameCells[c][d].stone.frameName == player2Col && (a[d][c] = 2) : a[d][c] = 0
            }
            return a
        },
        Player1Turn: function() {
            LOG("GetBoardMatrix");
            GameTurns++;
            imgGamePlayer1Fig.alpha = imgGamePlayer1Col.alpha = 1;
            imgGamePlayer2Fig.alpha = imgGamePlayer2Col.alpha = .5;
            activeCol = player1Col;
            SceneGame.instance.MakeAITurn()
        },
        Player2Turn: function() {
            LOG("Player2Turn");
            GameTurns++;
            imgGamePlayer1Fig.alpha = imgGamePlayer1Col.alpha = .5;
            imgGamePlayer2Fig.alpha = imgGamePlayer2Col.alpha = 1;
            activeCol =
                player2Col;
            SceneGame.instance.MakeAITurn()
        },
        SwitchPlayer: function() {
            LOG("SwitchPlayer");
            activeCol == player1Col ? SceneGame.instance.Player2Turn() : SceneGame.instance.Player1Turn()
        },
        MakeAITurn: function() {
            if (gameMode != HUMAN_PLAYER && activeCol != selectedCol) {
                LOG("MakeAITurn");
                ScenesTransitions.transitionStarted();
                var a = aiPlayer.GetNextMove();
                LOG("   MOVE [ " + a.columnMove + ", " + a.rowMove + " ] : " + a.score);
                game.time.events.add(250, function() {
                    SceneGame.instance.DropToken(this.move.columnMove, this.move.rowMove)
                }, {
                    move: a
                })
            }
        },
        OnPressedCell: function() {
            ScenesTransitions.transitionActive || (LOG("OnPressedCell"), SceneGame.instance.DropToken(this.button.X, this.button.Y))
        },
        DropToken: function(a, d) {
            gameRunning && !gameCells[a][d].stone.visible && (LOG("DropToken [" + a + ", " + d + "]"), gameCells[a][d].stone.frameName = activeCol, gameCells[a][d].stone.cachedTint = -1, gameCells[a][d].stone.visible = !0, gameCells[a][d].stone.width = 120, gameCells[a][d].stone.height = 120, gameCells[a][d].stone.alpha = 0, soundManager.playSound("droptoken"), ScenesTransitions.transitionStarted(),
                tween = game.add.tween(gameCells[a][d].stone), tween.to({
                    alpha: 1
                }, 240, Phaser.Easing.Linear.Out, !0, 0), tween.onComplete.add(function() {
                    if (SceneGame.instance.DoWeHave4InRow(activeCol, this.column, this.row)) {
                        gameRunning = !1;
                        var a = {
                                x: gameCells[crossedLineCoords.x1][crossedLineCoords.y1].position.x,
                                y: gameCells[crossedLineCoords.x1][crossedLineCoords.y1].position.y
                            },
                            b = {
                                x: gameCells[crossedLineCoords.x2][crossedLineCoords.y2].position.x,
                                y: gameCells[crossedLineCoords.x2][crossedLineCoords.y2].position.y
                            },
                            d = .4 * gameCells[0][0].width;
                        a.x == b.x ? a.y < b.y ? (a.y -= d, b.y += d) : (a.y += d, b.y -= d) : a.y == b.y ? a.x < b.x ? (a.x -= d, b.x += d) : (a.x += d, b.x -= d) : (a.x < b.x ? (a.x -= .7 * d, b.x += .7 * d) : (a.x += .7 * d, b.x -= .7 * d), a.y < b.y ? (a.y -= .7 * d, b.y += .7 * d) : (a.y += .7 * d, b.y -= .7 * d));
                        d = Phaser.Math.distance(a.x, a.y, b.x, b.y);
                        b = Phaser.Math.angleBetweenPoints(a, b);
                        sprCrossLine.position.setTo(a.x, a.y);
                        sprCrossLine.width = .1 * gameCells[0][0].width;
                        sprCrossLine.height = 0;
                        sprCrossLine.rotation = b + Phaser.Math.degToRad(90);
                        sprCrossLine.bringToTop();
                        btnGamePause.bringToTop();
                        soundManager.playSound("crossed");
                        tween = game.add.tween(sprCrossLine);
                        tween.to({
                            height: d
                        }, 200, Phaser.Easing.Back.Out, !0, 0);
                        imgResultWin.frameName = "win.png";
                        imgResultWinStone.visible = !0;
                        imgResultWinStone.frameName = activeCol;
                        ScenesTransitions.hideSceneAlpha(imgBackgroundDecor);
                        ScenesTransitions.hideSceneAlpha(btnGamePause);
                        tween = game.add.tween(imgGameBGAnchor);
                        tween.to({
                            offsY: 1
                        }, 150, Phaser.Easing.Linear.Out, !0, 0);
                        tween.onUpdateCallback(function(a, b, c) {
                            SceneGame.instance.onResolutionChange()
                        });
                        tween.onComplete.add(function() {
                            SceneGame.instance.onResolutionChange();
                            ScenesTransitions.transitionFinished()
                        }, this);
                        SceneGame.instance.onGameOver(GAME_OVER_GAME)
                    } else SceneGame.instance.DoWeHaveDraw(activeCol, this.column, this.row) ? (gameRunning = !1, imgResultWin.frameName = "draw.png", imgResultWinStone.visible = !1, ScenesTransitions.hideSceneAlpha(imgBackgroundDecor), ScenesTransitions.hideSceneAlpha(btnGamePause), tween = game.add.tween(imgGameBGAnchor), tween.to({
                            offsY: 1
                        }, 150, Phaser.Easing.Linear.Out, !0, 0), tween.onUpdateCallback(function(a, b, c) {
                            SceneGame.instance.onResolutionChange()
                        }),
                        tween.onComplete.add(function() {
                            SceneGame.instance.onResolutionChange();
                            ScenesTransitions.transitionFinished()
                        }, this), SceneGame.instance.onGameOver(GAME_OVER_GAME)) : activeCol == player1Col ? (SceneGame.instance.Player2Turn(), gameMode == HUMAN_PLAYER ? ScenesTransitions.transitionFinished() : selectedCol == player2Col && ScenesTransitions.transitionFinished()) : (SceneGame.instance.Player1Turn(), gameMode == HUMAN_PLAYER ? ScenesTransitions.transitionFinished() : selectedCol == player1Col && ScenesTransitions.transitionFinished())
                }, {
                    column: a,
                    row: d
                }), tween.start())
        },
        DoWeHaveDraw: function() {
            for (var a = 0; a < GAME_SIZE[gameSize]; a++)
                for (var d = 0; d < GAME_SIZE[gameSize]; d++)
                    if (!gameCells[a][d].stone.visible) return !1;
            return !0
        },
        DoWeHave4InRow: function(a, d, c, b) {
            return SceneGame.instance.GetSameCellsAtRow(a, d, c) >= (3 == GAME_SIZE[gameSize] ? 3 : 4) || SceneGame.instance.GetSameCellsAtCol(a, d, c) >= (3 == GAME_SIZE[gameSize] ? 3 : 4) || SceneGame.instance.GetSameCellsDiagonallyL(a, d, c) >= (3 == GAME_SIZE[gameSize] ? 3 : 4) || SceneGame.instance.GetSameCellsDiagonallyR(a,
                d, c) >= (3 == GAME_SIZE[gameSize] ? 3 : 4) ? (crossedLineCoords = SceneGame.instance.GetCrossLineCoords(), SceneGame.instance.resetMarks(), !0) : !1
        },
        GetCrossLineCoords: function() {
            for (var a = 100, d = 100, c = -1, b = -1, e = 0; e < GAME_SIZE[gameSize]; e++)
                for (var f = 0; f < GAME_SIZE[gameSize]; f++) gameCells[e][f].shine.visible && (e >= c || f >= b) && (c = e, b = f);
            for (e = GAME_SIZE[gameSize] - 1; 0 <= e; e--)
                for (f = GAME_SIZE[gameSize] - 1; 0 <= f; f--) gameCells[e][f].shine.visible && (e <= a || f <= d) && (a = e, d = f);
            return {
                x1: a,
                y1: d,
                x2: c,
                y2: b
            }
        },
        GetSameCellsAtCol: function(a,
            d, c, b) {
            b = 0;
            for (var e = c; e < gameCells[d].length; e++) gameCells[d][e].stone.frameName == a && gameCells[d][e].stone.visible ? (gameCells[d][e].shine.visible = !0, b++) : e = gameCells[d].length;
            for (e = c - 1; 0 <= e; e--) {
                if (gameCells[d][e].stone.frameName != a || !gameCells[d][e].stone.visible) return b < (3 == GAME_SIZE[gameSize] ? 3 : 4) && SceneGame.instance.resetMarks(), b;
                gameCells[d][e].shine.visible = !0;
                b++
            }
            b < (3 == GAME_SIZE[gameSize] ? 3 : 4) && SceneGame.instance.resetMarks();
            return b
        },
        GetSameCellsAtRow: function(a, d, c, b) {
            b = 0;
            for (var e = d; e <
                gameCells.length; e++) gameCells[e][c].stone.frameName == a && gameCells[e][c].stone.visible ? (gameCells[e][c].shine.visible = !0, b++) : e = gameCells.length;
            for (e = d - 1; 0 <= e; e--) {
                if (gameCells[e][c].stone.frameName != a || !gameCells[e][c].stone.visible) return b < (3 == GAME_SIZE[gameSize] ? 3 : 4) && SceneGame.instance.resetMarks(), b;
                gameCells[e][c].shine.visible = !0;
                b++
            }
            b < (3 == GAME_SIZE[gameSize] ? 3 : 4) && SceneGame.instance.resetMarks();
            return b
        },
        GetSameCellsDiagonallyL: function(a, d, c, b) {
            b = 0;
            for (var e = d, f = c; e < gameCells.length &&
                f < gameCells[0].length; e++, f++) gameCells[e][f].stone.frameName == a && gameCells[e][f].stone.visible ? (gameCells[e][f].shine.visible = !0, b++) : e = gameCells.length;
            e = d - 1;
            for (f = c - 1; 0 <= e && 0 <= f; e--, f--) gameCells[e][f].stone.frameName == a && gameCells[e][f].stone.visible ? (gameCells[e][f].shine.visible = !0, b++) : f = e = -1;
            b < (3 == GAME_SIZE[gameSize] ? 3 : 4) && SceneGame.instance.resetMarks();
            return b
        },
        GetSameCellsDiagonallyR: function(a, d, c, b) {
            b = 0;
            for (var e = d, f = c; e < gameCells.length && 0 <= f; e++, f--) gameCells[e][f].stone.frameName ==
                a && gameCells[e][f].stone.visible ? (gameCells[e][f].shine.visible = !0, b++) : (e = gameCells.length, f = -1);
            e = d - 1;
            for (f = c + 1; 0 <= e && f < gameCells[0].length; e--, f++) gameCells[e][f].stone.frameName == a && gameCells[e][f].stone.visible ? (LOG("[ " + e + ", " + f + " ]"), gameCells[e][f].shine.visible = !0, b++) : (e = -1, f = gameCells[0].length);
            b < (3 == GAME_SIZE[gameSize] ? 3 : 4) && SceneGame.instance.resetMarks();
            return b
        },
        resetMarks: function() {
            for (var a = 0; a < gameCells.length; a++)
                for (var d = 0; d < gameCells[a].length; d++) gameCells[a][d].shine.visible = !1
        },
        GetBoardVal: function(a, d) {
            return gameCells[a][d].stone.visible ? gameCells[a][d].stone.frameName == player1Col ? 1 : gameCells[a][d].stone.frameName == player2Col ? 2 : 0 : 0
        },
        reloadSkin: function(a) {},
        update: function() {
            SceneGame.instance.UpdateParticles();
            if (gameRunning && (GameTime += game.time.elapsedMS, txtGameTimeVal.text = "" + Math.round(GameTime / 1E3), null != gameCells))
                for (var a = gameCells[0][0].width / 2, d = 0; d < GAME_SIZE[gameSize]; d++)
                    for (var c = 0; c < GAME_SIZE[gameSize]; c++) Math.abs(game.input.activePointer.x - gameCells[d][c].worldPosition.x) >
                        a ? gameCells[d][c].tint = 16777215 : Math.abs(game.input.activePointer.y - gameCells[d][c].worldPosition.y) > a ? gameCells[d][c].tint = 16777215 : gameCells[d][c].tint = 11184810
        },
        onResolutionChange: function() {
            var a = .23 * -imgGameBGAnchor.offsY * game.height;
            imgGameBGAnchor.position.setTo(game.width / 2, .55 * game.height + a);
            imgGamePlayer1Bg.y = .1 * game.height + a;
            imgGamePlayer2Bg.y = imgGamePlayer1Bg.y;
            imgGameTimeBg.y = imgGamePlayer1Bg.y - 10;
            btnGamePause.position.setTo(40, game.height - 40);
            imgResultWin.height = .22 * game.height;
            imgResultWin.scale.x =
                imgResultWin.scale.y;
            imgResultWin.position.setTo(game.width / 2, imgGameBGAnchor.bottom + .5 * (game.height - imgGameBGAnchor.bottom) + (1 - imgGameBGAnchor.offsY) * game.height * .3);
            btnGameMainMenu.position.setTo(70, imgResultWin.top + .7 * imgResultWin.height);
            btnGameRestart.position.setTo(game.width - 70, imgResultWin.top + .7 * imgResultWin.height)
        },
        onPause: function() {
            soundManager.pauseMusic();
            gameRunning && (grpSceneGame.visible && !grpScenePause.visible && gameRunning && SceneGame.instance.OnPressedFromGameToPause(), soundManager.pauseMusic())
        },
        onResume: function() {
            soundManager.resumeMusic()
        },
        UpdateParticles: function() {
            particles.Update()
        },
        __RestartRound: function() {
            LOG("SceneGame.RestartGame");
            GameTurns = GameTime = gameScore = 0;
            activeCol = player1Col;
            SceneGame.instance.CreateBoard();
            sprCrossLine.position.setTo(-1E3, -1E3);
            for (var a = 0; a < GAME_SIZE[gameSize]; a++)
                for (var d = 0; d < GAME_SIZE[gameSize]; d++) gameCells[a][d].stone.visible = !1, gameCells[a][d].shine.visible = !1;
            selectedCol == player1Col ? (imgGamePlayer1Fig.frameName = "icons_0.png", imgGamePlayer2Fig.frameName =
                "icons_1.png") : (imgGamePlayer1Fig.frameName = "icons_1.png", imgGamePlayer2Fig.frameName = "icons_0.png");
            gameMode == HUMAN_PLAYER && (imgGamePlayer1Fig.frameName = "icons_0.png", imgGamePlayer2Fig.frameName = "icons_0.png");
            SceneGame.instance.Player1Turn();
            gameRunning = !0;
            gradle.event('btnRestart');
        },
        RestartRound: function() {
            game.paused = !1;
			this.__RestartRound();
			SceneGame.instance.onResolutionChange()
        },
        SaveGame: function(a) {
            GameData.Save()
        },
        LoadGame: function() {
            LOG("SceneGame.LoadGame()")
        },
        NewGame: function() {
            GameTime = ScoreOpponent = ScorePlayer = 0;
            SceneGame.instance.RestartRound()
        },
        ResumeRound: function() {
            gameRunning = !0;
            gamePaused = !1
        },
        OnPressedFromGameToPause: function() {
            gameRunning = !1;
            gamePaused = !0;
            SceneGame.instance.HideAnimated();
            ScenePause.instance.ShowAnimated()
        },
        ShowAnimated: function() {
            this.onResolutionChange();
            SceneGame.instance.onResolutionChange();
            SceneGame.instance.CreateBoard();
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
            ScenesTransitions.showSceneAlpha(grpSceneGame);
            ScenesTransitions.showSceneAlpha(btnGamePause)
        },
        HideAnimated: function() {
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
            ScenesTransitions.hideSceneAlpha(grpSceneGame, 100, 200, null)
        },
        onGameOver: function(a) {
            console.log("onGameOver", a)
        }
    };
    var GAME_OVER_GAME = 0,
        GAME_OVER_BY_USER = 1;
    var SceneOverlay = function() {
        SceneOverlay.instance = this;
        this.create()
    };
    SceneOverlay.instance = null;
    SceneOverlay.prototype = {
        create: function() {
            grpSceneOverlay = game.add.group();
            grpSceneOverlay.name = "grpSceneOverlay";
            imgOverlay = grpSceneOverlay.create(game.width >> 1, game.height >> 1, "pak", "blank.png");
            imgOverlay.anchor.set(.5);
            imgOverlay.width = game.width;
            imgOverlay.height = game.height;
            imgOverlay.alpha = .8;
            imgOverlay.tint = 1907997;
            imgOverlay.inputEnabled = !0;
            grpSceneOverlay.visible = !1
        },
        onResolutionChange: function() {
            imgOverlay.reset(game.width >> 1, game.height >> 1);
            imgOverlay.width = game.width;
            imgOverlay.height =
                game.height
        },
        ShowAnimated: function() {
            SceneOverlay.instance.onResolutionChange();
            ScenesTransitions.showSceneAlpha(grpSceneOverlay, 0, ScenesTransitions.TRANSITION_LENGTH)
        },
        HideAnimated: function() {
            ScenesTransitions.hideSceneAlpha(grpSceneOverlay, 0, ScenesTransitions.TRANSITION_LENGTH)
        }
    };
    var SceneLanguages = function() {
        SceneLanguages.instance = this;
        this.create()
    };
    SceneLanguages.instance = null;
    SceneLanguages.prototype = {
        create: function() {
            grpSceneLanguages = game.add.group();
            grpSceneLanguages.name = "grpSceneLanguages";
            imgLanguagesBackground = grpSceneLanguages.create(game.width >> 1, 0, "pak", "bg.png");
            imgLanguagesBackground.width = 1.1 * game.width;
            imgLanguagesBackground.height = game.height;
            imgLanguagesBackground.anchor.setTo(.5, 0);
            grpSceneLanguages.add(imgLanguagesBackground);
            imgLanguagesAnchor = grpSceneLanguages.create(game.width >> 1, game.height >> 1, "pak", "void.png");
            imgLanguagesAnchor.anchor.set(.5);
            var a = -110;
            btnLangEN = grpSceneLanguages.create(-97.5, a, "pak", "flag1.png");
            btnLangEN.anchor.set(.5);
            imgLanguagesAnchor.addChild(btnLangEN);
            AddButtonEvents(btnLangEN, this.OnPressedLangEN, ButtonOnInputOver, ButtonOnInputOut);
            btnLangDE = grpSceneLanguages.create(0, a, "pak", "flag4.png");
            btnLangDE.anchor.set(.5);
            imgLanguagesAnchor.addChild(btnLangDE);
            AddButtonEvents(btnLangDE, this.OnPressedLangDE, ButtonOnInputOver, ButtonOnInputOut);
            btnLangES = grpSceneLanguages.create(97.5, a, "pak", "flag6.png");
            btnLangES.anchor.set(.5);
            imgLanguagesAnchor.addChild(btnLangES);
            AddButtonEvents(btnLangES, this.OnPressedLangES, ButtonOnInputOver, ButtonOnInputOut);
            a += 110;
            btnLangFR = grpSceneLanguages.create(-97.5, a, "pak", "flag2.png");
            btnLangFR.anchor.set(.5);
            imgLanguagesAnchor.addChild(btnLangFR);
            AddButtonEvents(btnLangFR, this.OnPressedLangFR, ButtonOnInputOver, ButtonOnInputOut);
            btnLangIT = grpSceneLanguages.create(0, a, "pak", "flag5.png");
            btnLangIT.anchor.set(.5);
            imgLanguagesAnchor.addChild(btnLangIT);
            AddButtonEvents(btnLangIT, this.OnPressedLangIT,
                ButtonOnInputOver, ButtonOnInputOut);
            btnLangBR = grpSceneLanguages.create(97.5, a, "pak", "flag3.png");
            btnLangBR.anchor.set(.5);
            imgLanguagesAnchor.addChild(btnLangBR);
            AddButtonEvents(btnLangBR, this.OnPressedLangBR, ButtonOnInputOver, ButtonOnInputOut);
            btnLangRU = grpSceneLanguages.create(0, a + 110, "pak", "flag_ru.png");
            btnLangRU.anchor.set(.5);
            imgLanguagesAnchor.addChild(btnLangRU);
            AddButtonEvents(btnLangRU, this.OnPressedLangRU, ButtonOnInputOver, ButtonOnInputOut);
            grpSceneLanguages.visible = !1
        },
        reloadSkin: function(a) {},
        onResolutionChange: function() {
            imgLanguagesAnchor.position.setTo(game.width >> 1, game.height >> 1);
            imgLanguagesBackground.position.setTo(game.width >> 1, 0);
            imgLanguagesBackground.width = 1.1 * game.width;
            imgLanguagesBackground.height = game.height
        },
        OnPressedLangEN: function() {
            language = "en";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangDE: function() {
            language = "de";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangFR: function() {
            language = "fr";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangES: function() {
            language =
                "es";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangBR: function() {
            language = "pt";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangIT: function() {
            language = "it";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangNL: function() {
            language = "nl";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangTR: function() {
            language = "tr";
            sceneLanguages.OnLanguageSelected()
        },
        OnPressedLangRU: function() {
            language = "ru";
            sceneLanguages.OnLanguageSelected()
        },
        OnLanguageSelected: function() {
            gradle.event('btnLanguageSelected');
            try {
                localStorage.setItem("pwrwl-lang", "" + language)
            } catch (a) {}
            Languages.instance.language = language;
            languageLoaded = !0;
            null == gameState ? game.state.start("GameState") : (gameState.updateTexts(), SceneLanguages.instance.HideAnimated(), SceneToReturnFromLanguage.ShowAnimated(), SceneToReturnFromLanguage == SceneMenu.instance && SceneLogo.instance.ShowAnimated())
        },
        ShowAnimated: function() {
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
            ScenesTransitions.showSceneAlpha(grpSceneLanguages,
                0, ScenesTransitions.TRANSITION_LENGTH);
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In
        },
        HideAnimated: function() {
            ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
            ScenesTransitions.hideSceneAlpha(grpSceneLanguages, ScenesTransitions.TRANSITION_LENGTH);
            ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out
        }
    };
    var SceneInstructions = function() {
        SceneInstructions.instance = this;
        this.create()
    };
    SceneInstructions.instance = null;
    SceneInstructions.prototype = {
        create: function() {
            grpSceneInstructions = game.add.group();
            grpSceneInstructions.name = "grpSceneInstructions";
            imgInstructionsOverlay = grpSceneInstructions.create(0, 0, "pak", "blank.png");
            imgInstructionsOverlay.anchor.set(.5);
            imgInstructionsOverlay.tint = 0;
            imgInstructionsOverlay.alpha = .5;
            txtInstructionsCommon = new Phaser.Text(game, game.width >> 1, .3 * game.height, Str("INSTR_COMMON"), {
                fill: "#FFFFFF",
                font: "20px Arial",
                wordWrap: !0,
                wordWrapWidth: 380,
                align: "center"
            });
            txtInstructionsCommon.anchor.x =
                getCorrectAnchorX(txtInstructionsCommon, .5);
            txtInstructionsCommon.anchor.y = getCorrectAnchorY(txtInstructionsCommon, .2);
            txtInstructionsCommon.lineSpacing = -7;
            grpSceneInstructions.add(txtInstructionsCommon);
            btnInstructionsBack = SceneMenu.instance.createButtonWithIcon("pak", "bt_small.png", "icons_14.png", this.OnPressedInstructionsClose);
            btnInstructionsBack.anchor.set(.5);
            btnInstructionsBack.scale.set(1);
            AddButtonEvents(btnInstructionsBack, this.OnPressedInstructionsClose, ButtonOnInputOver, ButtonOnInputOut);
            grpSceneInstructions.add(btnInstructionsBack);
            grpSceneInstructions.visible = !1;
            this.onResolutionChange()
        },
        reloadSkin: function(a) {
            imgInstructionsBg.loadTexture(a, imgInstructionsBg.frameName)
        },
        onResolutionChange: function() {
            imgInstructionsOverlay.position.setTo(game.width / 2, game.height / 2);
            imgInstructionsOverlay.width = 1.1 * game.width;
            imgInstructionsOverlay.height = 1.1 * game.height;
            txtInstructionsCommon.reset(game.width / 2, game.height / 2);
            btnInstructionsBack.position.setTo(40, game.height - 40)
        },
        updateTexts: function() {
            txtInstructionsCommon.text =
                Str("INSTR_COMMON")
        },
        OnPressedInstructionsClose: function() {
            soundManager.playSound("menu-click1");
            SceneInstructions.instance.HideAnimated();
            SceneToReturnFromInstructions.ShowAnimated();
            SceneToReturnFromInstructions == ScenePause.instance && ScenesTransitions.hideSceneAlpha(imgBackgroundLogo)
        },
        ShowAnimated: function() {
            SceneInstructions.instance.onResolutionChange();
            gameRunning = !1;
            ScenesTransitions.transitionStarted();
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
            ScenesTransitions.showSceneAlpha(grpSceneInstructions,
                0, ScenesTransitions.TRANSITION_LENGTH);
            ScenesTransitions.showSceneScale(txtInstructionsCommon, 100, 200);
            ScenesTransitions.showSceneScale(btnInstructionsBack, 200, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Linear.In);
            ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In
        },
        HideAnimated: function() {
            ScenesTransitions.transitionStarted();
            ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
            ScenesTransitions.hideSceneAlpha(grpSceneInstructions, 100, 200, null);
            ScenesTransitions.TRANSITION_EFFECT_OUT =
                Phaser.Easing.Linear.Out
        },
        GetRenderTypeName: function(a) {
            switch (a) {
                case Phaser.AUTO:
                    return "AUTO";
                case Phaser.CANVAS:
                    return "CANVAS";
                case Phaser.WEBGL:
                    return "WEBGL"
            }
            return "NaN"
        }
    };
    var ScenePause = function() {
        ScenePause.instance = this;
        this.create()
    };
    ScenePause.instance = null;
    ScenePause.prototype = {
        create: function() {
            grpScenePause = game.add.group();
            grpScenePause.name = "grpScenePause";
            txtPausePause = game.add.text(0, 17, STR("PAUSE"), {
                font: "40px Arial",
                fill: "#FFFFFF",
                align: "center"
            });
            txtPausePause.anchor.x = .5;
            txtPausePause.anchor.y = .5;
            grpScenePause.addChild(txtPausePause);
            btnPauseResume = SceneMenu.instance.createButtonWithIcon("pak", "bt_long.png", "icons_9.png", ScenePause.instance.OnPressedResume);
            btnPauseResume.position.setTo(0, 0);
            grpScenePause.addChild(btnPauseResume);
            btnPauseRestart =
                SceneMenu.instance.createButtonWithIcon("pak", "bt_long.png", "icons_12.png", ScenePause.instance.OnPressedRestart);
            btnPauseRestart.position.setTo(0, 0);
            grpScenePause.addChild(btnPauseRestart);
            btnPauseMainMenu = SceneMenu.instance.createButtonWithIcon("pak", "bt_long.png", "icons_10.png", ScenePause.instance.OnPressedMainMenu);
            btnPauseMainMenu.position.setTo(0, 0);
            grpScenePause.addChild(btnPauseMainMenu);
            SOUNDS_ENABLED && (btnPauseMusic = SceneMenu.instance.createButtonWithIcon("pak", "bt_big.png", soundManager.musicPlaying ?
                "icons_2.png" : "icons_3.png",
                function() {
                    soundManager.toggleMusic("music_menu");
                    soundManager.toggleSounds();
                    btnMenuMusic.icon.frameName = soundManager.musicPlaying ? "icons_2.png" : "icons_3.png";
                    btnPauseMusic.icon.frameName = soundManager.musicPlaying ? "icons_2.png" : "icons_3.png"
                }), btnPauseMusic.anchor.set(.5), grpScenePause.addChild(btnPauseMusic));
            btnPauseInstructions = SceneMenu.instance.createButtonWithIcon("pak", "bt_big.png", "icons_15.png", this.OnPressedPauseInstructions);
            btnPauseInstructions.anchor.set(.5);
            grpScenePause.addChild(btnPauseInstructions);
            grpScenePause.visible = !1;
            this.onResolutionChange()
        },
        reloadSkin: function(a) {},
        onResolutionChange: function() {
            txtPausePause.position.setTo(game.width / 2, .2 * game.height);
            var a = .34 * game.height;
            btnPauseResume.position.setTo(game.width >> 1, a);
            a += 100;
            btnPauseRestart.position.setTo(game.width >> 1, a);
            a += 100;
            btnPauseMainMenu.position.setTo(game.width >> 1, a);
            var a = a + 100,
                d = 0;
            SOUNDS_ENABLED && (btnPauseMusic.position.setTo((game.width >> 1) - 85, a), d = 85);
            btnPauseInstructions.position.setTo((game.width >>
                1) + d, a)
        },
        updateTexts: function() {},
        OnPressedResume: function() {
            soundManager.playSound("menu-click1");
            ScenePause.instance.HideAnimated();
            SceneGame.instance.ShowAnimated();
            SceneGame.instance.ResumeRound()
        },
        OnPressedRestart: function() {
            soundManager.playSound("menu-click1");
            SceneGame.instance.onGameOver(GAME_OVER_BY_USER);
            ScenePause.instance.HideAnimated();
            SceneGame.instance.NewGame();
            SceneGame.instance.ShowAnimated()
        },
        OnPressedMainMenu: function() {
            soundManager.playSound("menu-click1");
            SceneGame.instance.onGameOver(GAME_OVER_BY_USER);
            ScenesTransitions.showSceneAlpha(imgBackgroundLogo);
            ScenePause.instance.HideAnimated();
            SceneGame.instance.HideAnimated();
            SceneMenu.instance.ShowAnimated();
            gradle.event('btnMainMenu');
        },
        OnPressedPauseInstructions: function() {
            soundManager.playSound("menu-click1");
            SceneToReturnFromInstructions = ScenePause.instance;
            ScenePause.instance.HideAnimated();
            ScenesTransitions.showSceneAlpha(imgBackgroundLogo);
            SceneInstructions.instance.ShowAnimated();
            gradle.event('btnPauseInstructions');
        },
        ShowAnimated: function(a) {
            void 0 === a && (a = 0);
            this.onResolutionChange();
            soundManager.playMusic("music_menu");
            soundManager.playSound("menu-click1");
            ScenesTransitions.transitionStarted();
            ScenesTransitions.showSceneAlpha(grpScenePause, 0, Phaser.Easing.Linear.In, ScenesTransitions.transitionFinished);
            ScenesTransitions.showSceneAlpha(grpScenePause, a + 100, 200);
            ScenesTransitions.showSceneScale(btnPauseResume, a + 200, 200, null, Phaser.Easing.Back.Out);
            ScenesTransitions.showSceneScale(btnPauseRestart,
                a + 300, 200, null, Phaser.Easing.Back.Out);
            ScenesTransitions.showSceneScale(btnPauseMainMenu, a + 400, 200, null, Phaser.Easing.Back.Out);
            SOUNDS_ENABLED && ScenesTransitions.showSceneScale(btnPauseMusic, a + 500, 200, null, Phaser.Easing.Back.Out);
            ScenesTransitions.showSceneScale(btnPauseInstructions, a + 500, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Back.Out)
        },
        HideAnimated: function() {
            ScenesTransitions.hideSceneAlpha(grpScenePause, 0, 200, null, Phaser.Easing.Linear.Out)
        }
    };
    var GameState = function(a) {},
        gameState = null,
        particles = null,
        coinParticles = null,
        textParticles = null;
    GameState.prototype = {
        preload: function() {
            game.input.onDown.add(function() {
                game.paused && (game.paused = !1)
            })
        },
        create: function() {
            game.stage.backgroundColor = 10781269;
            game.renderer.renderSession.roundPixels = !0;
            ScenesTransitions.TRANSITION_LENGTH *= .4;
            game.time.advancedTiming = !0;
            gameState = this;
            soundManager = new SoundManager(game);
            soundManager.create();
            scenes = [];
            scenes.push(new SceneBackground);
            scenes.push(new SceneMenu);
            scenes.push(new SceneGameSetup);
            scenes.push(new SceneGame);
            scenes.push(new SceneOverlay);
            scenes.push(new SceneInstructions);
            scenes.push(new SceneLanguages);
            scenes.push(new ScenePause);
            null != particles && particles.Destroy();
            particles = new Particles(grpSceneGame);
            null != coinParticles && coinParticles.Destroy();
            coinParticles = new CoinParticles(grpSceneGame);
            grpPrevLangScene = grpSceneGame;
            this.game.stage.backgroundColor = 397390;
            SceneBackground.instance.ShowAnimated();
            SceneMenu.instance.ShowAnimated(100);
            game.onPause.add(this.onGamePause, this);
            game.onResume.add(this.onGameResume, this);
            resizeCounter =
                0
        },
        update: function() {
            scenes.forEach(function(a) {
                "function" === typeof a.update && a.update()
            })
        },
        reloadSkin: function(a) {
            scenes.forEach(function(d) {
                "function" === typeof d.reloadSkin && d.reloadSkin(a)
            })
        },
        updateTexts: function() {
            scenes.forEach(function(a) {
                "function" === typeof a.updateTexts && a.updateTexts()
            })
        },
        onResolutionChange: function() {
            scenes.forEach(function(a) {
                if ("function" === typeof a.onResolutionChange) a.onResolutionChange()
            })
        },
        onGamePause: function() {
            LOG("onGamePause");
            scenes.forEach(function(a) {
                if ("function" ===
                    typeof a.onPause) a.onPause()
            });
            paused = !0;
            game.device.desktop && game.device.chrome && game.input.mspointer.stop()
        },
        onGameResume: function() {
            LOG("onGameResume");
            paused = !1;
            scenes.forEach(function(a) {
                if ("function" === typeof a.onResume) a.onResume()
            });
            game.device.desktop && game.device.chrome && game.input.mspointer.stop()
        },
        render: function() {
            "function" === typeof renderFunction && renderFunction()
        }
    };

    function showDiv(a, d) {
        null == d && (d = !1);
        if (!game.device.desktop || d) document.getElementById(a).style.display = "block"
    }

    function hideDiv(a, d) {
        null == d && (d = !1);
        if (!game.device.desktop || d) document.getElementById(a).style.display = "none"
    }

    function reloadPage() {
        window.location.reload(!0)
    };
    var ress = getMaxGameResolution(),
        resolutionX = ress[0],
        resolutionY = ress[1],
        languageLoaded = !1,
        isIOS = !1,
        userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) isIOS = !0;
    var aspect = window.innerWidth / window.innerHeight,
        androidVersionString = getAndroidVersion(),
        androidVersionMajor = 4;
    0 != androidVersionString && (androidVersionMajor = parseInt(getAndroidVersion(), 10));
    var GAME_FONT = "gameFont";
    4 > androidVersionMajor && (GAME_FONT = "arial");
    var game;

    function phaserInit() {
        selectedRenderer = Phaser.AUTO;
        MaliDetect() && (selectedRenderer = Phaser.CANVAS);
        isIOS && (selectedRenderer = Phaser.AUTO);
        game = new Phaser.Game({
            width: resolutionX,
            height: resolutionY,
            renderer: selectedRenderer,
            enableDebug: !0,
            antialias: !0,
            forceSetTimeOut: !1
        });
        game.forceSingleUpdate = !0;
        game.state.add("SplashState", Splash);
        game.state.add("PreloadState", Preloader);
        game.state.add("GameState", GameState);
        game.state.start("SplashState");
        document.documentElement.style.overflow = "hidden";
        document.body.scroll = "no"
    }
    phaserInit();

    function isPortrait() {
        switch (window.orientation) {
            case 0:
            case 180:
                return !0
        }
        return !1
    }

    function MaliDetect() {
        var a = document.createElement("canvas");
        a.setAttribute("width", "1");
        a.setAttribute("height", "1");
        document.body.appendChild(a);
        var d = document.getElementsByTagName("canvas"),
            a = d[0].getContext("webgl", {
                stencil: !0
            });
        d[0].parentNode.removeChild(d[0]);
        if (!a) return !1;
        d = a.getExtension("WEBGL_debug_renderer_info");
        if (null != d) a = a.getParameter(d.UNMASKED_RENDERER_WEBGL);
        else return !1;
        return -1 != a.search("Mali-400") ? !0 : !1
    }
    window.addEventListener("touchend", function() {
        if (null !== game) try {
            "running" !== game.sound.context.state && game.sound.context.resume()
        } catch (a) {}
    }, !1);
    window.addEventListener("contextmenu", function(a) {
        a.preventDefault()
    });
    isIOS || (document.addEventListener("touchstart", function(a) {
        a.preventDefault()
    }), document.addEventListener("touchmove", function(a) {
        a.preventDefault()
    }));
    
    
}();