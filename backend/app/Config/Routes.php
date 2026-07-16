<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

// Utilisateurs
$routes->get('utilisateurs', 'UtilisateurController::index');
$routes->get('utilisateurs/agents-terrain', 'UtilisateurController::agentsTerrain');
$routes->get('utilisateurs/agents-terrain-full', 'UtilisateurController::infoAgents');
$routes->get('utilisateurs/(:num)', 'UtilisateurController::show/$1');
$routes->post('utilisateurs', 'UtilisateurController::create');
$routes->match(['put', 'patch'], 'utilisateurs/(:num)', 'UtilisateurController::update/$1');
$routes->delete('utilisateurs/(:num)', 'UtilisateurController::delete/$1');

//Aires protégées
$routes->get('aires-protegees', 'AireProtegeeController::index');
$routes->get('aires-protegees/(:num)', 'AireProtegeeController::show/$1');
$routes->get('aires-protegees/(:num)/stats', 'AireProtegeeController::stats/$1');
$routes->get('aires-protegees/(:num)/tarifs', 'AireProtegeeController::getTarifs/$1');
$routes->get('aires-protegees/(:num)/visites', 'VisiteController::parAire/$1');
$routes->post('aires-protegees', 'AireProtegeeController::create');
$routes->match(['put', 'patch'], 'aires-protegees/(:num)', 'AireProtegeeController::update/$1');
$routes->delete('aires-protegees/(:num)', 'AireProtegeeController::delete/$1');

//Visites
$routes->get('visites', 'VisiteController::index');
$routes->get('visites/(:num)', 'VisiteController::show/$1');
$routes->post('visites', 'VisiteController::create');
$routes->match(['put', 'patch'], 'visites/(:num)', 'VisiteController::update/$1');
$routes->delete('visites/(:num)', 'VisiteController::delete/$1');

//Espèces
$routes->get('especes', 'EspeceController::index');
$routes->get('especes/menacees', 'EspeceController::menacees');
$routes->get('especes/(:num)', 'EspeceController::show/$1');
$routes->get('especes/(:num)/observations', 'ObservationController::parEspece/$1');
$routes->post('especes', 'EspeceController::create');
$routes->match(['put', 'patch'], 'especes/(:num)', 'EspeceController::update/$1');
$routes->delete('especes/(:num)', 'EspeceController::delete/$1');

//Observations
$routes->get('observations', 'ObservationController::index');
$routes->get('observations/(:num)', 'ObservationController::show/$1');
$routes->post('observations', 'ObservationController::create');
$routes->match(['put', 'patch'], 'observations/(:num)', 'ObservationController::update/$1');
$routes->delete('observations/(:num)', 'ObservationController::delete/$1');

//Incidents
$routes->get('incidents', 'IncidentController::index');
$routes->get('incidents/non-resolus', 'IncidentController::nonResolus');
$routes->get('incidents/statut/(:segment)', 'IncidentController::parStatut/$1');
$routes->get('incidents/(:num)', 'IncidentController::show/$1');
$routes->post('incidents', 'IncidentController::create');
$routes->match(['put', 'patch'], 'incidents/(:num)', 'IncidentController::update/$1');
$routes->delete('incidents/(:num)', 'IncidentController::delete/$1');
