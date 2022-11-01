## Simple Next.js Demo

```
git clone <this-repo>
npm install
npm audit fix --force
npm run dev
```
///notes///
Having school now so will not do as much, home modules css is the main file for css changes
Store link, meta and cdn stuff in the <HEAD> and remember to close it.
Going for a black and white theme for design choice, can change. 
The subjects pages are desgined to look like the figma one, but I feel like changing it soon.
JSON files are filled with filler text for now as well.
Spline animations are iframed and can be clicked to reach other links.
any thing with index.js usually acts like its own home page.
For FAQ, I am going for a tab style concept, but not really liking it.

///Content///

The legal section is taken from tick ninja and meant as filler text for eduhope.
Use of ai art in the about us section seems cool ngl, since we dont have any images.
Wanted to have scroll animations in the home page, but some times the js not working, so I just iframe from my repo for now. Link is here: https://github.com/iamsven2005/horizontal
As iframe is not a good option, feel like chaning it back to a less complex design.

///style///
Looks great! I like the fade in of the words at the start! Just thinking of these things, what do u think:
1. Maybe we can have a white/grey background like tick - i think it would be more appropriate for displaying tutor info?
2. U know like tick there r sections to it (for the landing page)? Was thinking we could adopt a similar design. So one section one background color then alternate. Then the top of the page can be buttons like "sign up as a tutor/tutee"
3. For displaying tutor info i thought instead of one box for each tutor we could have them in a list like tick's notes. I think it would be better if we displayed more tutors at one go since it allows for easier sorting + less emphasis on nailing the algorithm for sorting tutors
4. for sign up options im afraid its a bit messy cuz for tutors and tutees we wanna put benefits + faqs + description each. So if we put under one combined section may be a bit disorganised?
   --from telegram

///CSS///
CDN of font awesome sometimes have problems, dont load well.
Prof class means profile, meant to say navbar.
Multiple classes looks supported, but crashes some times, I just stuck to one for now.

CDN class" and style CLassName={styles.} when used together only works like 80% of the time. Not using for now.

My bad on making such a bad design system, still learning, much to do. If the design system changes can update readme file? Thanks
-Sven