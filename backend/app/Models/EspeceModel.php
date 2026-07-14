<?php

namespace App\Models;

use CodeIgniter\Model;

class EspeceModel extends Model
{
    protected $table            = 'especes';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    protected $allowedFields    = ['nom', 'nom_scientifique', 'population'];

    protected $validationRules  = [
        'nom'              => 'required|max_length[150]',
        'nom_scientifique' => 'required|max_length[150]',
        'population'       => 'required|integer|greater_than_equal_to[0]',
    ];

    // --- Méthodes métier ---
    public function especesMenacees(int $seuil = 100)
    {
        return $this->where('population <', $seuil)->findAll();
    }
}