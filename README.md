**Starlight Sprinter S**

A 2-D pixel-art platformer game using Arcade Phsyics in Phaser.
Visual assets courtesy of [Kenny Assets](https://kenney.nl/assets), with gratitude.
**Update 6/12/24:**
1. Added enemy avatars that will patrol around the map.
2. Added HP system that will deduct or grant under certain circumstances.
3. Now the game will stop when HP is too low and will restart when pressing R key
4. Added heart object and can gain HP by collecting it.
**Update 6/11/24:**
1. Added 3 different keys that are collectible in Farm, Food, Industrial but invisible at first
2. Once you collect all coins/gas in current level, the key spawns (you go to next level, you MISS it)
3. Once you collect all 3 keys, your fourth scene will be replaced with the **Bonus-level**
4. Enjoy the new content!

Instruction for play:
1. Use arrow keys to control player avatar's movement
2. Collect coins and gas by moving player's avatar to make a touch
3. To higher your score (as you see above the avatar), please collect as much as possible
4. Once you move to the next scene during the game, you can't retrieve to the last scene
5. Be careful with the patrolling enemies, they will deduct your hp. Grant hp by getting the heart'
6. Enjoy the Game!

Level-design:
1. Farm       (where you can collect coins)
2. Foodland   (where you can collect coins)
3. Industrial (where you can collect gas)
4. **Bonus-level** BRAND-NEW LEVEL UPDATED GO CHECK IT OUT!!!

Debug mode is not activated, to do this:
1. clone this repo
2. locate to ./src/Scenes/"scene".js (replace "scene" with "Farm", "Food", or "Industrail")
3. find comment looks like this: // debug key listener (assigned to D key)
4. remove the "// " from the following 1st and 4th line
5. "Go live" and press D then you will see