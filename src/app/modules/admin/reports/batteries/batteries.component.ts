import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { BatteriesService } from 'app/modules/admin/reports/batteries/batteries.service';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as Excel from 'exceljs/dist/exceljs.min.js';

@Component({
    selector: 'batteries',
    templateUrl: './batteries.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatteriesComponent implements OnInit {
    @ViewChild('reportNgForm') reportNgForm: NgForm;
    reportForm: FormGroup;
    panels: any;
    panelItem: any = [];
    formFieldHelpers: string[] = [''];
    reportData: any = [];
    panelname: any = '';
    stationname: any = '';
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _batteriesService: BatteriesService,
        private toastr: ToastrService
    ) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    ngOnInit(): void {
        this._batteriesService.getPanel().subscribe((response: any) => {
            if (response.status) {
                this.panels = response.data;
            }
        });

        this.reportForm = this._formBuilder.group({
            panel_name: ['', Validators.required],
            station: ['', Validators.required],
            // battery_no: ['', Validators.required],
            // batch_no: ['', Validators.required],
            batch_no: [''],
            select_date: ['', Validators.required],
        });
    }

    onPanelChange(event) {
        if (event.value) {
            const find = this.panels.find((resp) => resp._id === event.value);
            this.panelItem = find.ip_address;
            this.panelname = find.panel_name;
        }
    }

    /**
     * On submit
     */
    onSubmit(): void {
        this.reportData = [];
        // Return if the form is invalid
        if (this.reportForm.invalid) {
            return;
        }

        // Disable the form
        this.reportForm.disable();
        this._batteriesService
            .getBatteries({
                station: this.reportForm.value.station,
                select_date: DateTime.fromJSDate(
                    new Date(this.reportForm.value.select_date)
                ).toFormat('yyyy-MM-dd'),
            })
            .subscribe(
                (response: any) => {
                    if (response.status) {
                        this.reportData = response.data;
                        if (this.reportData?.length <= 0) {
                            this.toastr.info('No Data Found', 'Info');
                        }
                        this.reportForm.enable();
                        const stationindex = this.panelItem.findIndex(
                            (resp) => resp.port == this.reportForm.value.station
                        );
                        this.stationname = `Station ${stationindex + 1}`;
                    }
                },
                (response) => {
                    this.reportForm.enable();
                    this.toastr.error(response.error.error, 'Error');
                }
            );
    }

    generatePdf(indx) {
        const documentDefinition = this.getDocumentDefinition(indx);
        pdfMake
            .createPdf(documentDefinition)
            .download(
                `battery-report-${DateTime.local().toFormat('yyyy-MM-dd')}.pdf`
            );
    }

    getRowVal(batchno, data) {
        let rowarr = [];
        for (let index = 1; index < 18; index++) {
            rowarr.push([
                `31G${index}`,
                batchno,
                data.cycle1['b' + index].toFixed(2),
                data.cycle2['b' + index].toFixed(2),
                data.cycle3['b' + index].toFixed(2),
                data.cycle4['b' + index].toFixed(2),
            ]);
        }
        return rowarr;
    }

    // getRowVal(battryno, batchno, data) {
    //     let rowarr = [];
    //     for (let index = 1; index < 18; index++) {
    //         rowarr.push([
    //             `B${index}`,
    //             battryno,
    //             batchno,
    //             data.cycle1['b' + index].toFixed(2),
    //             data.cycle2['b' + index].toFixed(2),
    //             data.cycle3['b' + index].toFixed(2),
    //             data.cycle4['b' + index].toFixed(2),
    //         ]);
    //     }
    //     return rowarr;
    // }

    getDocumentDefinition(indx) {
        // let battryno = this.reportForm.value.battery_no;
        let batchno = this.reportForm.value.batch_no;
        let data = this.reportData[indx];
        return {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [25, 75, 25, 25],
            content: [
                {
                    columns: [
                        {
                            text: 'Individual Battery Box Test Report ',
                            width: 'auto',
                        },
                        {
                            columns: [
                                {
                                    image: 'unchecked',
                                    width: 12,
                                    height: 12,
                                    margin: [5, 2, 2, 0],
                                },
                                {
                                    text: '(With PT100)',
                                    margin: [10, 1, 5, 0],
                                },
                            ],
                            width: 'auto',
                        },
                        {
                            columns: [
                                {
                                    image: 'unchecked',
                                    width: 12,
                                    height: 12,
                                    margin: [0, 2, 2, 0],
                                },
                                {
                                    text: '(Without PT100)',
                                    margin: [5, 1, 0, 0],
                                },
                            ],
                            width: 'auto',
                        },
                    ],
                    alignment: 'left',
                    margin: [0, 0, 0, 0],
                    style: {
                        fontSize: 12,
                        bold: true,
                    },
                },

                {
                    columns: [
                        {
                            text: 'Battery Box: _ _ _ _ _ _ _ _  Blade: _ _ _ _ _ _ _ _',
                            width: '100%',
                        },
                    ],
                    margin: [0, 10, 0, 0],
                },
                {
                    columns: [
                        {
                            text: 'Battery Box Sr No: _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _',
                            width: '100%',
                        },
                    ],
                    margin: [0, 10, 10, 10],
                },
                {
                    table: {
                        headerRows: 5,
                        width: ['*', 100, '*', '*', 130, '*'],
                        body: [
                            [
                                {
                                    text: 'Charge & Discharge of Batteries',
                                    colSpan: 6,
                                    fontSize: 11,
                                    alignment: 'center',
                                },
                                '',
                                '',
                                '',
                                '',
                                '',
                            ],
                            [
                                {
                                    text: `Charge & Discharge\n${this.panelname}\n${this.stationname}`,
                                    width: 50,
                                    rowSpan: 2,
                                    colSpan: 3,
                                    fontSize: 11,
                                    alignment: 'left',
                                },
                                '',
                                '',
                                {
                                    text: 'Initial Charge',
                                    fontSize: 11,
                                    alignment: 'center',
                                },
                                {
                                    text: 'Discharge Test',
                                    fontSize: 11,
                                    alignment: 'center',
                                },
                                {
                                    text: 'Final Charge',
                                    fontSize: 11,
                                    alignment: 'center',
                                },
                            ],
                            [
                                '',
                                '',
                                '',
                                {
                                    text: 'Charge max. 3hrs OR cutoff at 100mA',
                                    fontSize: 11,
                                    alignment: 'left',
                                },
                                // {
                                //     columns: [
                                //         [
                                //             {
                                //                 width: '100%',
                                //                 stack: [
                                //                     {
                                //                         text: 'Charge Max',
                                //                         fontSize: 11,
                                //                         alignment: 'left',
                                //                     },

                                //                     {
                                //                         stack: [
                                //                             {
                                //                                 columns: [
                                //                                     {
                                //                                         image: 'unchecked',
                                //                                         height: 10,
                                //                                         width: 10,
                                //                                         margin: [
                                //                                             0,
                                //                                             2,
                                //                                             0,
                                //                                             0,
                                //                                         ],
                                //                                     },
                                //                                     {
                                //                                         text: '2 hrs',
                                //                                         margin: [
                                //                                             5,
                                //                                             0,
                                //                                             0,
                                //                                             0,
                                //                                         ],
                                //                                     },
                                //                                 ],
                                //                             },
                                //                         ],
                                //                     },
                                //                     {
                                //                         stack: [
                                //                             {
                                //                                 columns: [
                                //                                     {
                                //                                         image: 'unchecked',
                                //                                         height: 10,
                                //                                         width: 10,
                                //                                         margin: [
                                //                                             0,
                                //                                             2,
                                //                                             0,
                                //                                             0,
                                //                                         ],
                                //                                     },
                                //                                     {
                                //                                         text: '3 hrs',
                                //                                         margin: [
                                //                                             5,
                                //                                             0,
                                //                                             0,
                                //                                             0,
                                //                                         ],
                                //                                     },
                                //                                 ],
                                //                             },
                                //                         ],
                                //                     },
                                //                 ],
                                //             },
                                //         ],
                                //     ],
                                // },
                                {
                                    text: 'Discharge @5 to 6 Amp (Max 7 Amp) Duration - 30 minutes',
                                    fontSize: 11,
                                    alignment: 'left',
                                },
                                {
                                    text: 'Charge Max. 8hrs. OR cutoff at 100mA',
                                    fontSize: 11,
                                    alignment: 'left',
                                },
                            ],
                            [
                                {
                                    text: `Start Date Time: ${DateTime.fromJSDate(
                                        new Date(data.cycle1.createdAt)
                                    ).toFormat('dd-MM-yyyy HH:mm')}`,
                                    colSpan: 3,
                                },
                                '',
                                '',
                                '',
                                '',
                                '',
                            ],
                            [
                                {
                                    text: `End Date Time: ${DateTime.fromJSDate(
                                        new Date(data.createdAt)
                                    ).toFormat('dd-MM-yyyy HH:mm')}`,
                                    colSpan: 3,
                                },
                                '',
                                '',
                                '',
                                '',
                                '',
                            ],
                            [
                                'Battery Legend No.',
                                // 'Battery sr.no',
                                {
                                    text: 'Batch No.',
                                    noWrap: true,
                                },
                                `Battery Voltage before \ncharge \n≥ 12.0V`,
                                'Battery Voltage after Initial charge ≥ 12.7V',
                                `Battery Voltage during discharge (Record bat. \nvoltages during \ndischarge between 25 to 30 min.) ≥ 10.2V`,
                                'Battery Voltage after final charge ≥ 12.7V',
                            ],
                            // ...this.getRowVal(battryno, batchno, data),
                            ...this.getRowVal(batchno, data),
                            // [
                            //     {
                            //         text: 'Note - Batch No. - Write batch no. given by battery manufacturer or batch no. allotted by battery box manufacturer.',
                            //         colSpan: 6,
                            //         fontSize: 11,
                            //         alignment: 'left',
                            //         bold: true,
                            //         margin: [25, 10, 25, 10],
                            //     },
                            //     '',
                            //     '',
                            //     '',
                            //     '',
                            //     '',
                            // ],
                        ],
                    },
                },
            ],
            images: {
                unchecked:
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMzBUMDE6Mzc6MjArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjMGUyMmJhZC1lY2VkLTQzZWUtYjIzZC1jNDZjOTNiM2UzNWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5M2FhOTEzYy1hZDVmLWZmNGEtOWE5Ny1kMmUwZjdmYzFlYmUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYmY2ODFlMy1hMTRhLTQyODMtOGIxNi0zNjQ4M2E2YmZlNjYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiZjY4MWUzLWExNGEtNDI4My04YjE2LTM2NDgzYTZiZmU2NiIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozNzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMwZTIyYmFkLWVjZWQtNDNlZS1iMjNkLWM0NmM5M2IzZTM1YyIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozODo1NyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6AB6cQAAAPxJREFUOMvF1b1Kw1AYBuAnFf8QL8WlIHQJIriIdyEu4qCTXop7dwenTgUHpYvgJVhob8AuakE+h9hapJqcFDXvFDgPIXlzvgNLjnQ9GlRM340TK7DsUtRI2zqH09txxUzWn3IrhK4DecXs6wjhnqHwZk/K1fIiDAs81krCW54KPBDG8iTcNBIGf4ND1MWTdmrgqIOL5TM0S8SRhmMu1dAo+2DZ57t9eWajtKrvN1GVnrMK9HewhbBy+nPPJbTsJwmymOn8P7fkfLzQGCoG4G4S3vZc4J4QOnY0KyZ3LYQHjqcjf1Qxrx/inDXtWsfNlU1YdeZOP+Gg67mwwTvIDqR1iAowgQAAAABJRU5ErkJggg==',
            },
        };
    }

    generateExcel(indx): void {
        // let battryno = this.reportForm.value.battery_no;
        let batchno = this.reportForm.value.batch_no;
        let data = this.reportData[indx];
        var options = {
            filename: './streamed-workbook.xlsx',
            useStyles: true,
            useSharedStrings: true,
        };
        let workbook = new Excel.Workbook(options);

        var worksheet = workbook.addWorksheet('Battery Report', {
            properties: { tabColor: { argb: 'FFC0000' } },
        });

        worksheet.columns = [
            { header: '', key: 'a', width: 20 },
            { header: '', key: 'b', width: 20 },
            { header: '', key: 'c', width: 20 },
            { header: '', key: 'd', width: 15 },
            { header: '', key: 'e', width: 15 },
            { header: '', key: 'f', width: 30 },
            // { header: '', key: 'g', width: 15 },
        ];

        const header1 = worksheet.addRow([
            'Charge & Discharge of Batteries',
            '',
            '',
            '',
            '',
            '',
        ]);
        header1.font = { size: 12, bold: true };
        header1.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells('A5:F5');
        // worksheet.mergeCells('A2:F2');

        const header2 = worksheet.addRow([
            `Charge & Discharge :\r\n${this.panelname}\r\n${this.stationname}`,
            '',
            '',
            'Initial Charge',
            'Discharge Test',
            'Final Charge',
        ]);
        header2.font = { size: 12, bold: true };
        header2.alignment = { horizontal: 'left', vertical: 'top' };

        const header3 = worksheet.addRow([
            '',
            '',
            '',
            'Charge max. 3hrs OR cutoff at 100mA',
            'Discharge @5 to 6 Amp (Max 7 Amp) Duration - 30 minutes',
            'Charge Max. 8hrs. OR cutoff at 100mA',
        ]);
        header3.font = { size: 12, bold: true };
        header3.alignment = {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: true,
        };
        // worksheet.mergeCells('A3:C4');
        worksheet.mergeCells('A6:C7');

        const header4 = worksheet.addRow([
            `Start Time : ${DateTime.fromJSDate(
                new Date(data.cycle1.createdAt)
            ).toFormat('dd-MM-yyyy HH:mm a')}`,
            '',
            '',
            '',
            '',
            '',
            '',
        ]);
        header4.font = { size: 12, bold: true };
        header4.alignment = {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: true,
        };
        // worksheet.mergeCells('A5:C5');
        worksheet.mergeCells('A8:C8');

        const header5 = worksheet.addRow([
            `End Time : ${DateTime.fromJSDate(
                new Date(data.createdAt)
            ).toFormat('dd-MM-yyyy HH:mm a')}`,
            '',
            '',
            '',
            '',
            '',
            '',
        ]);
        header5.font = { size: 12, bold: true };
        header5.alignment = {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: true,
        };
        // worksheet.mergeCells('A6:C6');
        worksheet.mergeCells('A9:C9');

        const header6 = worksheet.addRow([
            'Battery Legend No.',
            // 'Battery sr.no',
            'Batch No.',
            'Battery Voltage before charge ≥ 12.0V',
            'Battery Voltage after Initial charge ≥ 12.7V',
            'Battery Volts during discharge (Record bat. voltages during discharge between 25 to 30 min.) ≥ 10.2V',
            'Battery Voltage after final charge ≥ 12.7V',
        ]);
        header6.font = { size: 12, bold: true };
        header6.alignment = {
            horizontal: 'left',
            vertical: 'top',
            wrapText: true,
        };

        for (let index = 1; index < 18; index++) {
            worksheet.getRow(7 + index).values = [
                `31G${index}`,
                // battryno,
                batchno,
                data.cycle1['b' + index].toFixed(2),
                data.cycle2['b' + index].toFixed(2),
                data.cycle3['b' + index].toFixed(2),
                data.cycle4['b' + index].toFixed(2),
            ];
        }

        workbook.xlsx.writeBuffer().then(function (buffer) {
            // done buffering
            const data: Blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            let url = window.URL.createObjectURL(data);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = 'battery-report-' + new Date().valueOf() + '.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
    }

    dateTimeFormat(date) {
        return DateTime.fromJSDate(new Date(date)).toFormat('dd-MM-yyyy HH:mm');
    }
}
