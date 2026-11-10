document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       Unit Converter
       Each linear category maps a unit to its size in the
       category's base unit (given in the comment beside it).
       ========================================================= */

    // Standard gas volumes are referenced to different temperatures, all at
    // 101.325 kPa (14.696 psia). Base unit for the category is Sm³ at 15 °C;
    // other references are corrected to it as an ideal gas.
    const T_SM3 = 288.15;                       // 15 °C
    const T_SCF = (60 - 32) * 5 / 9 + 273.15;   // 60 °F
    const T_NM3 = 273.15;                       // 0 °C
    const FT3 = 0.028316846592;                 // m³
    const SCF_IN_SM3 = FT3 * T_SM3 / T_SCF;
    const NM3_IN_SM3 = T_SM3 / T_NM3;

    const UNIT_CATEGORIES = {
        pressure: {
            label: 'Pressure',
            note: 'Converts the unit only: a gauge pressure stays gauge and an absolute pressure stays absolute.',
            units: {                            // Pa
                'Pa': 1,
                'kPa': 1e3,
                'MPa': 1e6,
                'bar': 1e5,
                'mbar': 100,
                'psi': 6894.757293168,
                'kg/cm²': 98066.5,
                'atm': 101325,
                'mmHg': 133.322387415
            }
        },
        temperature: {
            label: 'Temperature',
            special: true
        },
        length: {
            label: 'Length',
            units: {                            // m
                'mm': 0.001,
                'cm': 0.01,
                'm': 1,
                'km': 1000,
                'in': 0.0254,
                'ft': 0.3048,
                'mile': 1609.344
            }
        },
        area: {
            label: 'Area',
            units: {                            // m²
                'mm²': 1e-6,
                'cm²': 1e-4,
                'm²': 1,
                'in²': 0.00064516,
                'ft²': 0.09290304
            }
        },
        volume: {
            label: 'Volume',
            units: {                            // m³
                'L': 0.001,
                'm³': 1,
                'US gal': 0.003785411784,
                'UK gal': 0.00454609,
                'bbl': 0.158987294928,
                'ft³': FT3
            }
        },
        mass: {
            label: 'Mass',
            units: {                            // kg
                'g': 0.001,
                'kg': 1,
                'tonne': 1000,
                'lb': 0.45359237,
                'US ton': 907.18474,
                'UK ton': 1016.0469088
            }
        },
        flow: {
            label: 'Liquid / Volumetric Flow',
            units: {                            // m³/s
                'L/s': 0.001,
                'L/min': 0.001 / 60,
                'm³/h': 1 / 3600,
                'm³/d': 1 / 86400,
                'US gpm': 0.003785411784 / 60,
                'bbl/d': 0.158987294928 / 86400,
                'ft³/s': FT3
            }
        },
        gasflow: {
            label: 'Gas Flow (standard conditions)',
            note: 'Sm³ at 15 °C, scf at 60 °F and Nm³ at 0 °C, all at 101.325 kPa (14.696 psia). Converted between reference temperatures as an ideal gas, so 1 MMscf/d is about 28,262 Sm³/d.',
            units: {                            // Sm³/s
                'Sm³/h': 1 / 3600,
                'Sm³/d': 1 / 86400,
                'million Sm³/d': 1e6 / 86400,
                'Nm³/h': NM3_IN_SM3 / 3600,
                'scf/min': SCF_IN_SM3 / 60,
                'Mscf/d': SCF_IN_SM3 * 1e3 / 86400,
                'MMscf/d': SCF_IN_SM3 * 1e6 / 86400
            }
        },
        massflow: {
            label: 'Mass Flow',
            units: {                            // kg/s
                'kg/s': 1,
                'kg/h': 1 / 3600,
                't/h': 1000 / 3600,
                't/d': 1000 / 86400,
                'lb/s': 0.45359237,
                'lb/h': 0.45359237 / 3600
            }
        },
        density: {
            label: 'Density',
            units: {                            // kg/m³
                'kg/m³': 1,
                'g/cm³': 1000,
                'lb/ft³': 16.01846337,
                'lb/gal (US)': 119.826427
            }
        },
        velocity: {
            label: 'Velocity',
            units: {                            // m/s
                'm/s': 1,
                'ft/s': 0.3048,
                'km/h': 1 / 3.6,
                'mph': 0.44704
            }
        },
        energy: {
            label: 'Energy',
            units: {                            // J
                'J': 1,
                'kJ': 1e3,
                'MJ': 1e6,
                'GJ': 1e9,
                'kWh': 3.6e6,
                'BTU': 1055.05585262,
                'MMBtu': 1055.05585262e6
            }
        },
        power: {
            label: 'Power',
            units: {                            // W
                'W': 1,
                'kW': 1000,
                'MW': 1e6,
                'hp': 745.699872,
                'BTU/h': 0.29307107
            }
        },
        viscosity: {
            label: 'Dynamic Viscosity',
            units: {                            // Pa·s
                'Pa·s': 1,
                'mPa·s': 0.001,
                'cP': 0.001,
                'P': 0.1
            }
        },
        kinviscosity: {
            label: 'Kinematic Viscosity',
            units: {                            // m²/s
                'm²/s': 1,
                'mm²/s': 1e-6,
                'cSt': 1e-6,
                'St': 1e-4
            }
        }
    };

    const TEMP_TO_KELVIN = {
        '°C': v => v + 273.15,
        '°F': v => (v - 32) * 5 / 9 + 273.15,
        'K': v => v,
        '°R': v => v * 5 / 9
    };
    const TEMP_FROM_KELVIN = {
        '°C': v => v - 273.15,
        '°F': v => (v - 273.15) * 9 / 5 + 32,
        'K': v => v,
        '°R': v => v * 9 / 5
    };

    // Seven significant figures, without trailing zeros or floating-point residue.
    function formatNumber(n) {
        if (!isFinite(n)) return '';
        if (n === 0) return '0';
        const abs = Math.abs(n);
        if (abs >= 1e9 || abs < 1e-6) {
            return n.toExponential(6).replace(/\.?0+e/, 'e');
        }
        return String(parseFloat(n.toPrecision(7)));
    }

    const categorySelect = document.getElementById('conv-category');
    const fromValue = document.getElementById('conv-from-value');
    const fromUnit = document.getElementById('conv-from-unit');
    const toValue = document.getElementById('conv-to-value');
    const toUnit = document.getElementById('conv-to-unit');
    const swapBtn = document.getElementById('conv-swap');
    const convNote = document.getElementById('conv-note');

    if (categorySelect) {
        const unitsForCategory = (catKey) => {
            const cat = UNIT_CATEGORIES[catKey];
            return cat.special ? Object.keys(TEMP_TO_KELVIN) : Object.keys(cat.units);
        };

        const populateCategories = () => {
            Object.keys(UNIT_CATEGORIES).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = UNIT_CATEGORIES[key].label;
                categorySelect.appendChild(opt);
            });
        };

        const populateUnitSelects = () => {
            const cat = UNIT_CATEGORIES[categorySelect.value];
            const units = unitsForCategory(categorySelect.value);
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
            convNote.textContent = cat.note || '';
        };

        const convert = () => {
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
                result = input * cat.units[fromUnit.value] / cat.units[toUnit.value];
            }

            toValue.value = formatNumber(result);
        };

        populateCategories();
        populateUnitSelects();
        fromUnit.value = 'bar';
        toUnit.value = 'psi';
        convert();

        categorySelect.addEventListener('change', () => { populateUnitSelects(); convert(); });
        fromUnit.addEventListener('change', convert);
        toUnit.addEventListener('change', convert);
        fromValue.addEventListener('input', convert);

        swapBtn.addEventListener('click', () => {
            const previousFrom = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = previousFrom;
            if (toValue.value !== '') fromValue.value = toValue.value;
            convert();
        });
    }

    /* =========================================================
       Pipe Schedule Reference

       Outside diameters and wall thicknesses (inches) per ASME
       B36.10M (carbon and alloy steel) and B36.19M (stainless,
       for the 5S / 10S thicknesses). Cross-checked against two
       independently published reference tables in November 2026.
       Internal diameter and weight are calculated, not tabulated,
       using the plain-end mass formulas given in B36.10M.
       ========================================================= */

    // B36.10M plain-end mass for carbon steel: kg/m = 0.0246615 (D - t) t
    // with D and t in mm, and lb/ft = 10.69 (D - t) t with D and t in inches.
    const MASS_FACTOR_METRIC = 0.0246615;
    const MASS_FACTOR_IMPERIAL = 10.69;

    const PIPE_DATA = [
        { nps: '1/2', dn: 15, od: 0.840, odMm: 21.3, sch: { 5: 0.065, 10: 0.083, 40: 0.109, 80: 0.147, 160: 0.188, XXS: 0.294 } },
        { nps: '3/4', dn: 20, od: 1.050, odMm: 26.7, sch: { 5: 0.065, 10: 0.083, 40: 0.113, 80: 0.154, 160: 0.219, XXS: 0.308 } },
        { nps: '1', dn: 25, od: 1.315, odMm: 33.4, sch: { 5: 0.065, 10: 0.109, 40: 0.133, 80: 0.179, 160: 0.250, XXS: 0.358 } },
        { nps: '1-1/4', dn: 32, od: 1.660, odMm: 42.2, sch: { 5: 0.065, 10: 0.109, 40: 0.140, 80: 0.191, 160: 0.250, XXS: 0.382 } },
        { nps: '1-1/2', dn: 40, od: 1.900, odMm: 48.3, sch: { 5: 0.065, 10: 0.109, 40: 0.145, 80: 0.200, 160: 0.281, XXS: 0.400 } },
        { nps: '2', dn: 50, od: 2.375, odMm: 60.3, sch: { 5: 0.065, 10: 0.109, 40: 0.154, 80: 0.218, 160: 0.344, XXS: 0.436 } },
        { nps: '2-1/2', dn: 65, od: 2.875, odMm: 73.0, sch: { 5: 0.083, 10: 0.120, 40: 0.203, 80: 0.276, 160: 0.375, XXS: 0.552 } },
        { nps: '3', dn: 80, od: 3.500, odMm: 88.9, sch: { 5: 0.083, 10: 0.120, 40: 0.216, 80: 0.300, 160: 0.438, XXS: 0.600 } },
        { nps: '4', dn: 100, od: 4.500, odMm: 114.3, sch: { 5: 0.083, 10: 0.120, 40: 0.237, 80: 0.337, 120: 0.438, 160: 0.531, XXS: 0.674 } },
        { nps: '6', dn: 150, od: 6.625, odMm: 168.3, sch: { 5: 0.109, 10: 0.134, 40: 0.280, 80: 0.432, 120: 0.562, 160: 0.719, XXS: 0.864 } },
        { nps: '8', dn: 200, od: 8.625, odMm: 219.1, sch: { 5: 0.109, 10: 0.148, 20: 0.250, 30: 0.277, 40: 0.322, 60: 0.406, 80: 0.500, 100: 0.594, 120: 0.719, 140: 0.812, 160: 0.906, XXS: 0.875 } },
        { nps: '10', dn: 250, od: 10.750, odMm: 273.0, sch: { 5: 0.134, 10: 0.165, 20: 0.250, 30: 0.307, 40: 0.365, 60: 0.500, 80: 0.594, 100: 0.719, 120: 0.844, 140: 1.000, 160: 1.125, XXS: 1.000 } },
        { nps: '12', dn: 300, od: 12.750, odMm: 323.8, sch: { 5: 0.156, 10: 0.180, 20: 0.250, 30: 0.330, 40: 0.406, 60: 0.562, 80: 0.688, 100: 0.844, 120: 1.000, 140: 1.125, 160: 1.312, XXS: 1.000 } },
        { nps: '14', dn: 350, od: 14.000, odMm: 355.6, sch: { 5: 0.156, 10: 0.250, 20: 0.312, 30: 0.375, 40: 0.438, 60: 0.594, 80: 0.750, 100: 0.938, 120: 1.094, 140: 1.250, 160: 1.406 } },
        { nps: '16', dn: 400, od: 16.000, odMm: 406.4, sch: { 5: 0.165, 10: 0.250, 20: 0.312, 30: 0.375, 40: 0.500, 60: 0.656, 80: 0.844, 100: 1.031, 120: 1.219, 140: 1.438, 160: 1.594 } },
        { nps: '18', dn: 450, od: 18.000, odMm: 457.0, sch: { 5: 0.165, 10: 0.250, 20: 0.312, 30: 0.438, 40: 0.562, 60: 0.750, 80: 0.938, 100: 1.156, 120: 1.375, 140: 1.562, 160: 1.781 } },
        { nps: '20', dn: 500, od: 20.000, odMm: 508.0, sch: { 5: 0.188, 10: 0.250, 20: 0.375, 30: 0.500, 40: 0.594, 60: 0.812, 80: 1.031, 100: 1.281, 120: 1.500, 140: 1.750, 160: 1.969 } },
        { nps: '24', dn: 600, od: 24.000, odMm: 610.0, sch: { 5: 0.218, 10: 0.250, 20: 0.375, 30: 0.562, 40: 0.688, 60: 0.969, 80: 1.219, 100: 1.531, 120: 1.812, 140: 2.062, 160: 2.344 } }
    ];

    // The weight classes are fixed thicknesses that track a numbered schedule
    // only at smaller sizes: STD = Sch 40 through NPS 10, then 0.375 in;
    // XS = Sch 80 through NPS 8, then 0.500 in.
    PIPE_DATA.forEach(row => {
        row.sch.STD = row.od <= 10.75 ? row.sch[40] : 0.375;
        row.sch.XS = row.od <= 8.625 ? row.sch[80] : 0.500;
    });

    const SCHEDULES = [
        ['5', 'Schedule 5'],
        ['10', 'Schedule 10'],
        ['20', 'Schedule 20'],
        ['30', 'Schedule 30'],
        ['40', 'Schedule 40'],
        ['STD', 'STD (standard weight)'],
        ['60', 'Schedule 60'],
        ['80', 'Schedule 80'],
        ['XS', 'XS (extra strong)'],
        ['100', 'Schedule 100'],
        ['120', 'Schedule 120'],
        ['140', 'Schedule 140'],
        ['160', 'Schedule 160'],
        ['XXS', 'XXS (double extra strong)']
    ];

    const scheduleSelect = document.getElementById('pipe-schedule');
    const unitToggle = document.getElementById('pipe-units');
    const pipeTableBody = document.querySelector('#pipe-table tbody');
    const pipeCaption = document.querySelector('#pipe-table caption');

    if (scheduleSelect) {
        const fixed = (n, dp) => n.toFixed(dp);

        const populateSchedules = () => {
            SCHEDULES.forEach(([value, label]) => {
                const opt = document.createElement('option');
                opt.value = value;
                opt.textContent = label;
                scheduleSelect.appendChild(opt);
            });
            scheduleSelect.value = '40';
        };

        const renderPipeTable = () => {
            const sch = scheduleSelect.value;
            const metric = unitToggle.value === 'metric';
            const label = SCHEDULES.find(([value]) => value === sch)[1];
            pipeTableBody.innerHTML = '';
            pipeCaption.textContent = `${label}, ${metric ? 'metric' : 'imperial'} units`;

            PIPE_DATA.forEach(row => {
                const wtIn = row.sch[sch];
                const tr = document.createElement('tr');
                const head = `<th scope="row">${row.nps}"</th><td>${row.dn}</td>`;

                if (wtIn === undefined) {
                    tr.innerHTML = `${head}<td colspan="4" class="pipe-na">Not tabulated for this schedule</td>`;
                    pipeTableBody.appendChild(tr);
                    return;
                }

                const odIn = row.od;
                const odMm = row.odMm;
                // The standard tabulates metric wall thickness to 0.01 mm.
                const wtMm = Math.round(wtIn * 25.4 * 100) / 100;

                tr.innerHTML = metric
                    ? `${head}
                        <td>${fixed(odMm, 1)}</td>
                        <td>${fixed(wtMm, 2)}</td>
                        <td>${fixed(odMm - 2 * wtMm, 1)}</td>
                        <td>${fixed(MASS_FACTOR_METRIC * (odMm - wtMm) * wtMm, 2)}</td>`
                    : `${head}
                        <td>${fixed(odIn, 3)}</td>
                        <td>${fixed(wtIn, 3)}</td>
                        <td>${fixed(odIn - 2 * wtIn, 3)}</td>
                        <td>${fixed(MASS_FACTOR_IMPERIAL * (odIn - wtIn) * wtIn, 2)}</td>`;
                pipeTableBody.appendChild(tr);
            });

            document.querySelectorAll('.pipe-unit-label').forEach(el => {
                el.textContent = metric ? 'mm' : 'in';
            });
            document.getElementById('pipe-weight-unit').textContent = metric ? 'kg/m' : 'lb/ft';
        };

        populateSchedules();
        renderPipeTable();

        scheduleSelect.addEventListener('change', renderPipeTable);
        unitToggle.addEventListener('change', renderPipeTable);
    }
});
