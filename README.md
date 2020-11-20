# Zeebe

Dieses Repository enthält alle Kernkozepte von Zeebe: Einer Workflow Engine für die Microservice Orchestration

# Vorbereitung für die Übungen

1. Bitte führen Sie nach einem clone dieses Repositorys ein `bash setup.sh` aus.
2. Anschließend gehen Sie in das docker-Verzeichnis und führen Sie `docker-compose up --force-recreate` aus
3. Testen Sie ob alles geklapt hat indem Sie http://localhost:8080 besuchen und sich in Camunda-Operate mit Benutzernamen `demo` und Passwort `demo` anmelden.
4. Zudem sollte unter http://localhost:8090 eine Website für die "Scooter-Buchung" erreichbar sein.
5. Testen Sie ebenfalls das Kommando `bash zeebe-modeler.sh`. Es sollte sich der Zeebe-Modeler öffnen.

Falls alles reibungslos funktioniert hat sind Sie bereit für die Übung. Vergessen Sie nicht die docker-container aus Schritt 2 "gracefully" herunterzufahren indem Sie STRG+C im Terminal drücken oder in einem paralellen Terminal den Befehl `docker-compose stop` verwenden.

Vielen Dank!

Getestet unter Linux-VM von Prof. Thöne; Linux Mint 19.3 Cinnamon
