document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       Unit Converter
       ========================================================= */

    const UNIT_CATEGORIES = {
        pressure: {
            label: 'Pressure',
            base: 'Pa',
            units: {
                'Pa': 1,
                'kPa': 1e3,
                'MPa': 1e6,
                'bar': 1e5,
                'psi': 6894.757293168,
                'kg/cm²': 98066.5,
                'atm': 101325
            }
        },
        temperature: {
            label: 'Temperature',
            special: true
        },
        length: {
            label: 'Length',
            base: 'm',
            units: {
                'mm': 0.001,
                'cm': 0.01,
                'm': 1,
                'in': 0.0254,
                'ft': 0.3048
            }
        },
        mass: {
            label: 'Mass',
            base: 'kg',
            units: {
                'g': 0.001,
                'kg': 1,
                'lb': 0.45359237,
                'tonne': 1000,
                'US ton': 907.18474
            }
        },
        volume: {
            label: 'Volume',
            base: 'm³',
            units: {
                'L': 0.001,
                'm³': 1,
                'US gal': 0.003785411784,
                'bbl': 0.158987294928,
                'ft³': 0.028316846592
            }
        },
        flow: {
            label: 'Flow Rate',
            base: 'm³/s',
            units: {
                'L/min': 0.001 / 60,
                'm³/h': 1 / 3600,
                'm³/d': 1 / 86400,
                'US gpm': 0.003785411784 / 60,
                'bbl/d': 0.158987294928 / 86400,
                'MMscfd': 0.028316846592 * 1e6 / 86400
            }
        },
        density: {
            label: 'Density',
            base: 'kg/m³',
            units: {
                'kg/m³': 1,
                'g/cm³': 1000,
                'lb/ft³': 16.01846337,
                'lb/gal (US)': 119.826427
            }
        },
        velocity: {
            label: 'Velocity',
            base: 'm/s',
            units: {
                'm/s': 1,
                'ft/s': 0.3048,
                'km/h': 1 / 3.6,
                'mph': 0.44704
            }
        },
        power: {
            label: 'Power',
            base: 'W',
            units: {
                'W': 1,
                'kW': 1000,
                'MW': 1e6,
                'hp': 745.699872,
                'BTU/h': 0.29307107
            }
        },
        viscosity: {
            label: 'Dynamic Viscosity',
            base: 'Pa·s',
            units: {
                'Pa·s': 1,
                'cP': 0.001,
                'mPa·s': 0.001,
                'P': 0.1
            }
        }
    };

    const TEMP_TO_KELVIN = {
        'C': v => v + 273.15,
        'F': v => (v - 32) * 5 / 9 + 273.15,
        'K': v => v
    };
    const TEMP_FROM_KELVIN = {
        'C': v => v - 273.15,
        'F': v => (v - 273.15) * 9 / 5 + 32,
        'K': v => v
    };

    const categorySelect = document.getElementById('conv-category');
    const fromValue = document.getElementById('conv-from-value');
    const fromUnit = document.getElementById('conv-from-unit');
    const toValue = document.getElementById('conv-to-value');
    const toUnit = document.getElementById('conv-to-unit');
    const swapBtn = document.getElementById('conv-swap');

    if (categorySelect) {
        function populateCategories() {
            Object.keys(UNIT_CATEGORIES).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = UNIT_CATEGORIES[key].label;
                categorySelect.appendChild(opt);
            });
        }

        function unitsForCategory(catKey) {
            const cat = UNIT_CATEGORIES[catKey];
            return cat.special ? ['C', 'F', 'K'] : Object.keys(cat.units);
        }

        function populateUnitSelects() {
            const cat = categorySelect.value;
            const units = unitsForCategory(cat);
            [fromUnit, toUnit].forEach(select => {
                select.innerHTML = '';
                units.forEach(u => {
                    const opt = document.createElement('option');
                    opt.value = u;
                    opt.textContent = u;
                    select.appendChild(opt);
                });
            });
            toUnit.selectedIndex = units.length > 1 ? 1 : 0;
        }

        function convert() {
            const cat = UNIT_CATEGORIES[categorySelect.value];
            const input = parseFloat(fromValue.value);
            if (isNaN(input)) {
                toValue.value = '';
                return;
            }

            let result;
            if (cat.special) {
                const kelvin = TEMP_TO_KELVIN[fromUnit.value](input);
                result = TEMP_FROM_KELVIN[toUnit.value](kelvin);
            } else {
                const baseValue = input * cat.units[fromUnit.value];
                result = baseValue / cat.units[toUnit.value];
            }

            toValue.value = formatNumber(result);
        }

        function formatNumber(n) {
            if (Math.abs(n) >= 100000 || (Math.abs(n) < 0.0001 && n !== 0)) {
                return n.toExponential(4);
            }
            return parseFloat(n.toFixed(6)).toString();
        }

        populateCategories();
        populateUnitSelects();
        convert();

        categorySelect.addEventListener('change', () => { populateUnitSelects(); convert(); });
        fromUnit.addEventListener('change', convert);
        toUnit.addEventListener('change', convert);
        fromValue.addEventListener('input', convert);

        swapBtn.addEventListener('click', () => {
            const tmpUnit = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = tmpUnit;
            fromValue.value = toValue.value;
            convert();
        });
    }

    /* =========================================================
       Pipe Schedule Reference
       Nominal sizes and outside diameters per ASME B36.10M.
       Wall thickness figures are drawn from general engineering
       reference knowledge, not a live lookup against the current
       standard — verify before use in detailed design (see the
       note under the table).
       ========================================================= */

    const STEEL_DENSITY_KG_M3 = 7850;
    const IN_TO_M = 0.0254;
    const M_TO_FT = 3.280839895;
    const KG_M_TO_LB_FT = 0.671968975;

    const PIPE_DATA = [
        { nps: '1/2', od: 0.840, sch: { 5: 0.065, 10: 0.083, 40: 0.109, 80: 0.147, 160: 0.187, XXS: 0.294 } },
        { nps: '3/4', od: 1.050, sch: { 5: 0.065, 10: 0.083, 40: 0.113, 80: 0.154, 160: 0.219, XXS: 0.308 } },
        { nps: '1', od: 1.315, sch: { 5: 0.065, 10: 0.109, 40: 0.133, 80: 0.179, 160: 0.250, XXS: 0.358 } },
        { nps: '1-1/4', od: 1.660, sch: { 5: 0.065, 10: 0.109, 40: 0.140, 80: 0.191, 160: 0.250, XXS: 0.382 } },
        { nps: '1-1/2', od: 1.900, sch: { 5: 0.065, 10: 0.109, 40: 0.145, 80: 0.200, 160: 0.281, XXS: 0.400 } },
        { nps: '2', od: 2.375, sch: { 5: 0.065, 10: 0.109, 40: 0.154, 80: 0.218, 160: 0.343, XXS: 0.436 } },
        { nps: '2-1/2', od: 2.875, sch: { 5: 0.083, 10: 0.120, 40: 0.203, 80: 0.276, 160: 0.375, XXS: 0.552 } },
        { nps: '3', od: 3.500, sch: { 5: 0.083, 10: 0.120, 40: 0.216, 80: 0.300, 160: 0.438, XXS: 0.600 } },
        { nps: '4', od: 4.500, sch: { 5: 0.083, 10: 0.120, 40: 0.237, 80: 0.337, 120: 0.437, 160: 0.531, XXS: 0.674 } },
        { nps: '6', od: 6.625, sch: { 5: 0.109, 10: 0.134, 40: 0.280, 80: 0.432, 120: 0.562, 160: 0.719, XXS: 0.864 } },
        { nps: '8', od: 8.625, sch: { 5: 0.109, 10: 0.148, 20: 0.250, 30: 0.277, 40: 0.322, 60: 0.406, 80: 0.500, 100: 0.594, 120: 0.719, 140: 0.812, 160: 0.906, XXS: 0.875 } },
        { nps: '10', od: 10.750, sch: { 5: 0.134, 10: 0.165, 20: 0.250, 30: 0.307, 40: 0.365, 60: 0.500, 80: 0.594, 100: 0.719, 120: 0.844, 140: 1.000, 160: 1.125 } },
        { nps: '12', od: 12.750, sch: { 5: 0.156, 10: 0.180, 20: 0.250, 30: 0.330, 40: 0.406, 60: 0.562, 80: 0.688, 100: 0.844, 120: 1.000, 140: 1.125, 160: 1.312 } },
        { nps: '14', od: 14.000, sch: { 10: 0.250, 20: 0.312, 30: 0.375, 40: 0.438, 60: 0.594, 80: 0.750, 100: 0.938, 120: 1.094, 140: 1.250, 160: 1.406 } },
        { nps: '16', od: 16.000, sch: { 10: 0.250, 20: 0.312, 30: 0.375, 40: 0.500, 60: 0.656, 80: 0.844, 100: 1.031, 120: 1.219, 140: 1.438, 160: 1.594 } },
        { nps: '18', od: 18.000, sch: { 10: 0.250, 20: 0.312, 30: 0.438, 40: 0.562, 60: 0.750, 80: 0.938, 100: 1.156, 120: 1.375, 140: 1.562, 160: 1.781 } },
        { nps: '20', od: 20.000, sch: { 10: 0.250, 20: 0.375, 30: 0.500, 40: 0.594, 60: 0.812, 80: 1.031, 100: 1.281, 120: 1.500, 140: 1.750, 160: 1.969 } },
        { nps: '24', od: 24.000, sch: { 10: 0.250, 20: 0.375, 30: 0.562, 40: 0.688, 60: 0.969, 80: 1.219, 100: 1.531, 120: 1.812, 140: 2.062, 160: 2.344 } }
    ];

    const ALL_SCHEDULES = ['5', '10', '20', '30', '40', '60', '80', '100', '120', '140', '160', 'XXS'];

    const scheduleSelect = document.getElementById('pipe-schedule');
    const unitToggle = document.getElementById('pipe-units');
    const pipeTableBody = document.querySelector('#pipe-table tbody');

    if (scheduleSelect) {
        function populateSchedules() {
            ALL_SCHEDULES.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.textContent = 'Schedule ' + s;
                scheduleSelect.appendChild(opt);
            });
            scheduleSelect.value = '40';
        }

        function round(n, dp) {
            return parseFloat(n.toFixed(dp));
        }

        function renderPipeTable() {
            const sch = scheduleSelect.value;
            const metric = unitToggle.value === 'metric';
            pipeTableBody.innerHTML = '';

            PIPE_DATA.forEach(row => {
                const wtIn = row.sch[sch];
                const tr = document.createElement('tr');

                if (wtIn === undefined) {
                    tr.innerHTML = `<td>${row.nps}"</td><td colspan="4" class="pipe-na">Not tabulated for this schedule</td>`;
                    pipeTableBody.appendChild(tr);
                    return;
                }

                const odIn = row.od;
                const idIn = odIn - 2 * wtIn;
                const odM = odIn * IN_TO_M;
                const wtM = wtIn * IN_TO_M;
                const idM = idIn * IN_TO_M;
                const weightKgM = Math.PI * STEEL_DENSITY_KG_M3 * wtM * (odM - wtM);
                const weightLbFt = weightKgM * KG_M_TO_LB_FT;

                if (metric) {
                    tr.innerHTML = `
                        <td>${row.nps}"</td>
                        <td>${round(odM * 1000, 1)}</td>
                        <td>${round(wtM * 1000, 2)}</td>
                        <td>${round(idM * 1000, 1)}</td>
                        <td>${round(weightKgM, 2)}</td>`;
                } else {
                    tr.innerHTML = `
                        <td>${row.nps}"</td>
                        <td>${round(odIn, 3)}</td>
                        <td>${round(wtIn, 3)}</td>
                        <td>${round(idIn, 3)}</td>
                        <td>${round(weightLbFt, 2)}</td>`;
                }
                pipeTableBody.appendChild(tr);
            });

            document.querySelectorAll('.pipe-unit-label').forEach(el => {
                el.textContent = metric ? 'mm' : 'in';
            });
            const weightLabel = document.getElementById('pipe-weight-unit');
            if (weightLabel) weightLabel.textContent = metric ? 'kg/m' : 'lb/ft';
        }

        populateSchedules();
        renderPipeTable();

        scheduleSelect.addEventListener('change', renderPipeTable);
        unitToggle.addEventListener('change', renderPipeTable);
    }
});
