- [ ] Idée : anonymiser la notification de prise. -> mode discret
- [ ] widget apple (vraiment nécessaire ?)
- [ ] thèmes en IAP. (thème Chaton)
- [ ] Vous aimez pilbo ?
- [ ] Android : proposer la mise à jour dans l'app (API « in-app updates » de Google Play).
- [ ] iPhone : prévenir dans l'app qu'une nouvelle version est disponible sur l'App Store (demande un appel réseau à Apple, à concilier avec la page de confidentialité).
- [ ] Modale « Quoi de neuf dans Pilbo ? » au premier lancement après une mise à jour.
- [ ] Avertissement en cas de prise manquée "Ne prenez pas la prise en double plus tard" (seulement si ce n'est pas la dernière). Voir si ça pose un problème puisque l'app propose un "avis médical". Ajoutez "demander conseil à votre pharmacien / docteur".
- [ ] Mode paysage (accessibilité, WCAG 1.3.4 « Orientation », niveau AA) : l'app est verrouillée en portrait (`orientation: "portrait"` dans `app.config.ts`), ce qui gêne par exemple les personnes en fauteuil dont le téléphone est fixé en paysage. Retirer le verrouillage et adapter tous les écrans (modales, clavier, footers, listes, onboarding), surtout sur iPhone 12 mini et avec un grand texte. Supprime aussi l'avertissement du Play Store sur `android.hardware.screen.portrait`. À traiter dans une spec dédiée.

Bug :

Rien
