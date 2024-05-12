<script lang="ts" setup>
  // Core
  import { reactive, ref } from 'vue'

	// Componentes
  import titulo from '@components/layout/tituloLayout.vue'
</script>
<template>
	<main>
    <div class="panel">
      <titulo title="Perfil de Operador Cadastrado" />

      <div class="table-responsive my-3">
        <table>
          <thead>
            <tr>
              <th>Funcionalidade</th>
              <th>Perfil 1</th>
              <th>Perfil 2</th>
              <th>Perfil 3</th>
              <th>Perfil 4</th>
              <th>Perfil 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consultas</td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
            </tr>
            <tr>
              <td>Cadastros</td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
            </tr>
            <tr>
              <td>Operações</td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
              <td><input type="checkbox" class="form-checkbox rounded-full" checked /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<style lang="scss" scoped>
thead tr {
  font-size: 14px;
  font-weight: 600;
  color: #1384AD;
}
tbody tr {
  font-size: 12px;
  font-weight: 400;
  color: #0E1726;
}
tr {
  text-align: center;
}
</style>
